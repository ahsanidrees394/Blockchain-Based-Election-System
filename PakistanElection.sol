// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PakistanElectionDApp
 * @dev Decentralized Election System for Pakistan
 * @notice Candidates register with CNIC & eligibility info; voters vote with CNIC
 */
contract PakistanElection {

    // ─────────────────────────────────────────────
    //  STRUCTS
    // ─────────────────────────────────────────────

    struct Candidate {
        uint256 id;
        string cnic;            // 13-digit CNIC (hashed on-chain)
        string fullName;
        uint8  age;
        string nationality;     // Must be "Pakistani"
        string religion;
        string province;
        string constituency;
        string party;
        string manifesto;
        string educationLevel;  // e.g., "Matric", "Graduation", "Masters", "PhD"
        bool   hasCriminalRecord;
        bool   isApproved;      // Admin approves after verification
        uint256 voteCount;
        uint256 registeredAt;
    }

    struct Voter {
        string cnic;            // 13-digit CNIC
        string fullName;
        uint8  age;
        string province;
        string constituency;
        bool   hasVoted;
        uint256 votedFor;       // Candidate ID
        uint256 registeredAt;
    }

    struct Election {
        string  name;
        uint256 startTime;
        uint256 endTime;
        bool    isActive;
        uint256 totalVotes;
    }

    // ─────────────────────────────────────────────
    //  STATE VARIABLES
    // ─────────────────────────────────────────────

    address public admin;
    Election public currentElection;

    uint256 private candidateCount;
    uint256 private voterCount;

    // cnicHash => Candidate
    mapping(bytes32 => Candidate) private candidates;
    // cnicHash => Voter
    mapping(bytes32 => Voter)     private voters;
    // candidateId => cnicHash (for iteration)
    mapping(uint256 => bytes32)   private candidateById;
    // Track registered CNICs to prevent duplicates
    mapping(bytes32 => bool) private registeredCNICs;

    // ─────────────────────────────────────────────
    //  EVENTS
    // ─────────────────────────────────────────────

    event CandidateRegistered(uint256 indexed id, string fullName, string constituency);
    event CandidateApproved(uint256 indexed id, string fullName);
    event VoterRegistered(bytes32 indexed cnicHash, string constituency);
    event VoteCast(bytes32 indexed voterCnicHash, uint256 indexed candidateId);
    event ElectionStarted(string name, uint256 startTime, uint256 endTime);
    event ElectionEnded(uint256 totalVotes);

    // ─────────────────────────────────────────────
    //  MODIFIERS
    // ─────────────────────────────────────────────

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier electionActive() {
        require(currentElection.isActive, "No active election");
        require(block.timestamp >= currentElection.startTime, "Election not started yet");
        require(block.timestamp <= currentElection.endTime,   "Election has ended");
        _;
    }

    modifier validCNIC(string memory cnic) {
        require(bytes(cnic).length == 13, "CNIC must be 13 digits");
        _;
    }

    // ─────────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────────

    constructor() {
        admin = msg.sender;
    }

    // ─────────────────────────────────────────────
    //  ADMIN FUNCTIONS
    // ─────────────────────────────────────────────

    /// @notice Create / start a new election
    function createElection(
        string memory _name,
        uint256 _durationInSeconds
    ) external onlyAdmin {
        require(!currentElection.isActive, "Election already active");
        currentElection = Election({
            name:       _name,
            startTime:  block.timestamp,
            endTime:    block.timestamp + _durationInSeconds,
            isActive:   true,
            totalVotes: 0
        });
        emit ElectionStarted(_name, block.timestamp, block.timestamp + _durationInSeconds);
    }

    /// @notice Approve a candidate after off-chain verification
    function approveCandidate(uint256 _candidateId) external onlyAdmin {
        bytes32 cnicHash = candidateById[_candidateId];
        require(cnicHash != bytes32(0), "Candidate not found");
        candidates[cnicHash].isApproved = true;
        emit CandidateApproved(_candidateId, candidates[cnicHash].fullName);
    }

    /// @notice End the election manually
    function endElection() external onlyAdmin {
        require(currentElection.isActive, "No active election");
        currentElection.isActive = false;
        emit ElectionEnded(currentElection.totalVotes);
    }

    // ─────────────────────────────────────────────
    //  CANDIDATE REGISTRATION
    // ─────────────────────────────────────────────

    /**
     * @notice Register as a candidate
     * Pakistan eligibility rules encoded:
     *  - Must be Pakistani national
     *  - Age >= 25
     *  - No criminal record declared
     *  - Must provide valid CNIC
     */
    function registerCandidate(
        string memory _cnic,
        string memory _fullName,
        uint8         _age,
        string memory _nationality,
        string memory _religion,
        string memory _province,
        string memory _constituency,
        string memory _party,
        string memory _manifesto,
        string memory _educationLevel,
        bool          _hasCriminalRecord
    ) external validCNIC(_cnic) {

        // ── Eligibility checks (Article 62/63, Constitution of Pakistan) ──
        require(_age >= 25,                             "Must be at least 25 years old");
        require(
            keccak256(bytes(_nationality)) == keccak256(bytes("Pakistani")),
            "Must be a Pakistani national"
        );
        require(!_hasCriminalRecord,                    "Criminal record disqualifies candidacy");

        bytes32 cnicHash = keccak256(abi.encodePacked(_cnic));
        require(!registeredCNICs[cnicHash],             "CNIC already registered");

        candidateCount++;
        candidates[cnicHash] = Candidate({
            id:               candidateCount,
            cnic:             _cnic,   // Store raw for display (consider hashing in prod)
            fullName:         _fullName,
            age:              _age,
            nationality:      _nationality,
            religion:         _religion,
            province:         _province,
            constituency:     _constituency,
            party:            _party,
            manifesto:        _manifesto,
            educationLevel:   _educationLevel,
            hasCriminalRecord:_hasCriminalRecord,
            isApproved:       false,
            voteCount:        0,
            registeredAt:     block.timestamp
        });

        candidateById[candidateCount] = cnicHash;
        registeredCNICs[cnicHash]     = true;

        emit CandidateRegistered(candidateCount, _fullName, _constituency);
    }

    // ─────────────────────────────────────────────
    //  VOTER REGISTRATION
    // ─────────────────────────────────────────────

    /// @notice Register as a voter using CNIC
    function registerVoter(
        string memory _cnic,
        string memory _fullName,
        uint8         _age,
        string memory _province,
        string memory _constituency
    ) external validCNIC(_cnic) {

        require(_age >= 18, "Must be at least 18 years old to vote");

        bytes32 cnicHash = keccak256(abi.encodePacked(_cnic));
        require(!registeredCNICs[cnicHash], "CNIC already registered");

        voters[cnicHash] = Voter({
            cnic:         _cnic,
            fullName:     _fullName,
            age:          _age,
            province:     _province,
            constituency: _constituency,
            hasVoted:     false,
            votedFor:     0,
            registeredAt: block.timestamp
        });

        registeredCNICs[cnicHash] = true;
        voterCount++;

        emit VoterRegistered(cnicHash, _constituency);
    }

    // ─────────────────────────────────────────────
    //  VOTING
    // ─────────────────────────────────────────────

    /// @notice Cast vote for a candidate using CNIC
    function castVote(
        string memory _voterCnic,
        uint256       _candidateId
    ) external electionActive validCNIC(_voterCnic) {

        bytes32 voterHash = keccak256(abi.encodePacked(_voterCnic));
        Voter storage voter = voters[voterHash];

        require(bytes(voter.cnic).length > 0, "Voter not registered");
        require(!voter.hasVoted,              "Already voted");

        bytes32 candidateHash = candidateById[_candidateId];
        require(candidateHash != bytes32(0),   "Candidate does not exist");
        require(candidates[candidateHash].isApproved, "Candidate not approved");

        // Same constituency check
        require(
            keccak256(bytes(voter.constituency)) ==
            keccak256(bytes(candidates[candidateHash].constituency)),
            "Candidate not in your constituency"
        );

        voter.hasVoted  = true;
        voter.votedFor  = _candidateId;
        candidates[candidateHash].voteCount++;
        currentElection.totalVotes++;

        emit VoteCast(voterHash, _candidateId);
    }

    // ─────────────────────────────────────────────
    //  VIEW FUNCTIONS
    // ─────────────────────────────────────────────

    function getCandidateCount() external view returns (uint256) {
        return candidateCount;
    }

    function getVoterCount() external view returns (uint256) {
        return voterCount;
    }

    function getCandidateById(uint256 _id) external view returns (
        uint256 id, string memory fullName, uint8 age,
        string memory nationality, string memory religion,
        string memory province, string memory constituency,
        string memory party, string memory manifesto,
        string memory educationLevel, bool isApproved, uint256 voteCount
    ) {
        bytes32 h = candidateById[_id];
        require(h != bytes32(0), "Not found");
        Candidate memory c = candidates[h];
        return (
            c.id, c.fullName, c.age, c.nationality, c.religion,
            c.province, c.constituency, c.party, c.manifesto,
            c.educationLevel, c.isApproved, c.voteCount
        );
    }

    function getVoterByCNIC(string memory _cnic) external view returns (
        string memory fullName, uint8 age,
        string memory province, string memory constituency,
        bool hasVoted, uint256 votedFor
    ) {
        bytes32 h = keccak256(abi.encodePacked(_cnic));
        Voter memory v = voters[h];
        require(bytes(v.cnic).length > 0, "Voter not found");
        return (v.fullName, v.age, v.province, v.constituency, v.hasVoted, v.votedFor);
    }

    function getElectionInfo() external view returns (
        string memory name, uint256 startTime, uint256 endTime,
        bool isActive, uint256 totalVotes
    ) {
        Election memory e = currentElection;
        return (e.name, e.startTime, e.endTime, e.isActive, e.totalVotes);
    }

    function isCNICRegistered(string memory _cnic) external view returns (bool) {
        return registeredCNICs[keccak256(abi.encodePacked(_cnic))];
    }
}
