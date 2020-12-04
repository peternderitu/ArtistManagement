pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";

/// @title An artist management dapp
/// @author Peter Ndiritu
/// @notice You can use this contract to manage artist activities on a basic level
/// @dev All function calls are currently implemented without side effects
contract ArtistManagement {
    using SafeMath for uint256;
// state variables including contract owner
    address owner;
    uint256 private musicidCount;
    uint256 private artistCount;
    uint256 private managerCount;
// enum that describes the state of Music
    enum State {ForSale, Sold}
// evwnts of all state changes
    event LogForSale(uint256 musicId);
    event LogSold(uint256 musicId);
    event Logaddartist(string name, string citizenship, uint256 age);
    event Logaddmusic(string name, string genre, uint256 price);
    event Logaddmanager(string name, address addr, uint256 salary);
    event Loghiremanager(uint256 managerid);
// the manager,artist and music structs
    struct Manager {
        string name;
        address payable addr;
        uint256 salary;
        uint256 managerId;
    }
    struct Artist {
        string name;
        string citizenship;
        uint256 age;
        uint256 artistId;
        address payable artist;
    }
    struct Music {
        string name;
        string genre;
        State musicstate;
        uint256 price;
        uint256 musicId;
        address payable buyer;
    }

    Music[13] public catalog;
   // Circuit breaker design pattern
    bool public stopped = false;

    modifier stopInEmergency {
        require(!stopped);
        _;
    }
    modifier onlyInEmergency {
        require(stopped);
        _;
    }
    // A lookup of all the structs with their id as the key value
    mapping(uint256 => Artist) public artists;
    mapping(uint256 => Music) public music;
    mapping(uint256 => Manager) public managers;
    
    // checks that msg.value is same as price and refunds buyer any extra eth sent
    modifier checkValue(uint256 _musicid) {
        _;
        uint256 _price = music[_musicid].price;
        uint256 amountToRefund = msg.value - _price;
        music[_musicid].buyer.transfer(amountToRefund);
    }
    //modifier that restricts a function's access to artist
    modifier onlyArtist(uint256 _artistId) {
        require(msg.sender == artists[_artistId].artist);
        _;
    }
    // modifier marks music item forsale after being added into mapping
    modifier forsale(uint256 _musicId) {
        music[_musicId].musicstate = State.ForSale;
        _;
    }
// this changes state after music item is paid
    modifier sold(uint256 _musicId) {
        music[_musicId].musicstate = State.Sold;
        _;
    }

    constructor() public {
        msg.sender == owner;
        musicidCount = 0;
        artistCount = 0;
        managerCount = 0;
    }

    /// @notice Adds artist into storage
    /// @dev function adds parameters and stores into structs
    /// @return artist Count

    function addartist(
        string memory _name,
        string memory _citizenship,
        uint256 _age
    ) public returns (uint256) {
        artistCount++;
        artists[artistCount] = Artist({
            name: _name,
            citizenship: _citizenship,
            age: _age,
            artistId: artistCount,
            artist: msg.sender
        });
        emit Logaddartist(_name, _citizenship, _age);
        return artistCount;
    }

    /// @notice Adds music into storage
    /// @dev Has to be an artistnto call function
    function addmusic(
        string memory name,
        string memory genre,
        uint256 price,
        uint256 artistId
    ) public onlyArtist(artistId) {
        musicidCount++;
        music[musicidCount] = Music(
            name,
            genre,
            State.ForSale,
            price,
            musicidCount,
            address(0)
        );
        emit Logaddmusic(name, genre, price);
        emit LogForSale(musicidCount);
    }

    /// @notice Buy music and update state as well as buyer
    /// @dev Payable function
    function buymusic(uint256 _musicId, uint256 _artistId)
        public
        payable
        forsale(_musicId)
        checkValue(_musicId)
    {
        music[_musicId].buyer = msg.sender;
        artists[_artistId].artist.transfer(music[_musicId].price);
        music[_musicId].musicstate = State.Sold;
        emit LogSold(_musicId);
    }

    /// @notice Adds manager into storage
    /// @dev function adds parameters and stores into structs

    /// @return manager Count
    function addmanager(string memory _name, uint256 salary)
        public
        returns (uint256)
    {
        managerCount++;
        managers[managerCount] = Manager({
            name: _name,
            addr: msg.sender,
            salary: salary,
            managerId: managerCount
        });
        emit Logaddmanager(_name, msg.sender, salary);
        return managerCount;
    }

    /// @notice hire manager by artist
    /// @dev payable function

    function hiremanager(uint256 managerid, uint256 periodinmonths)
        public
        payable
    {
        require(periodinmonths > 0);
        uint256 salarypaid = periodinmonths.mul(managers[managerid].salary);
        managers[managerid].addr.transfer(salarypaid);
        emit Loghiremanager(managerid);
    }

    /* We have these functions completed to run tests as well as fetch data:) */

    function fetchArtist(uint256 _artistid)
        public
        view
        returns (
            string memory name,
            string memory citizenship,
            uint256 age,
            uint256 artistId,
            address artist
        )
    {
        name = artists[_artistid].name;
        citizenship = artists[_artistid].citizenship;
        age = artists[_artistid].age;
        artistId = artists[_artistid].artistId;
        artist = artists[_artistid].artist;
        return (name, citizenship, age, artistId, artist);
    }

    /* We have these functions completed to run tests as well as fetch data:) */

    function fetchMusic(uint256 _musicid)
        public
        view
        returns (
            string memory name,
            string memory genre,
            uint256 musicstate,
            uint256 price,
            uint256 musicId,
            address buyer
        )
    {
        name = music[_musicid].name;
        genre = music[_musicid].genre;
        musicstate = uint256(music[_musicid].musicstate);
        price = music[_musicid].price;
        musicId = music[_musicid].musicId;
        buyer = music[_musicid].buyer;
        return (name, genre, musicstate, price, musicId, buyer);
    }

    /* We have these functions completed to run tests as well as fetch data:) */

    function fetchManager(uint256 _managerid)
        public
        view
        returns (
            string memory name,
            address addr,
            uint256 salary,
            uint256 managerId
        )
    {
        name = managers[_managerid].name;
        addr = managers[_managerid].addr;
        salary = managers[_managerid].salary;
        managerId = managers[_managerid].managerId;
        return (name, addr, salary, managerId);
    }
}
