1. Circuit Breaker design pattern:
	bool public stopped = false;

    modifier stopInEmergency {
        require(!stopped);
        _;
    }
    modifier onlyInEmergency {
        require(stopped);
        _;
    }
	function buymusic(uint256 _musicId, uint256 _artistId)
        public
        payable
        forsale(_musicId)
        checkValue(_musicId)
        onlyInEmergency
    {
        music[_musicId].buyer = msg.sender;
        artists[_artistId].artist.transfer(music[_musicId].price);
        music[_musicId].musicstate = State.Sold;
        emit LogSold(_musicId);
    }
2. Restricting Access(Having private state variables): 
	uint256 private musicidCount;
    	uint256 private artistCount;
    	uint256 private managerCount;
	
	Having a function that can only be called by the Artist
		modifier onlyArtist(uint256 _artistId) {
        		require(msg.sender == artists[_artistId].artist);
        		_;
    		}
