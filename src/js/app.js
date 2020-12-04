
App = {
    web3Provider: null,
	contracts: {},
	artistId: 0,
    name: null,
    title: null,
    Name: null,
    buffer: '',
    ipfsHash:null,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    artist: "0x0000000000000000000000000000000000000000",
    citizenship: null,
    age: null,
    genre: null,
    price: 0,
	salary: 0,
    buyer: "0x0000000000000000000000000000000000000000",
    addr: "0x0000000000000000000000000000000000000000",
    


    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
	},
	readForm: function () {
        App.name = $("#name").val();
        App.citizenship = $("#citizenship").val();
        App.age = $("#age").val();
        App.genre = $("#genre").val();
        App.title = $("#name2").val();
        App.Name = $("#name3").val();
        App.ipfsHash = $("#ipfs").val();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            console.log(App.web3Provider);
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        //App.getMetaskAccountID();
        return App.initArtistManagement();
    },
    

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);
        web3.eth.getCoinbase(function(err, account) {
          if (err === null) {
            App.metamaskAccountID = account;
            $("#accountAddress").html("Your Account: " + account);
          }
        });
        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }

            App.metamaskAccountID = res[0];
            if (res.length > 1){
            document.getElementById("divType").innerText = "Ganache Address"
            console.log("Using Ganache");
            App.FarmerID = res[1];
            document.getElementById("artist").value = App.artist;
            App.DistributorID = res[2];
            document.getElementById("buyer").value = App.buyer;
            App.RetailerID = res[3];
            document.getElementById("addr").value = App.addr;
          }else{
            document.getElementById("divType").innerText = "Using MetaMask Address"
            App.artist = document.getElementById("artist").value;
            App.buyer = document.getElementById("buyer").value;
            App.addr = document.getElementById("addr").value;
          }

        })
	},
	initArtistManagement: function () {
        /// Source the truffle compiled smart contracts
        var jsonArtistManagement='ArtistManagement.json';
        //var json
        /// JSONfy the smart contracts
        $.getJSON(jsonArtistManagement, function(data) {
            console.log('data',data);
            var ArtistManagementArtifact = data;
            App.contracts.ArtistManagement = TruffleContract(ArtistManagementArtifact);
            App.contracts.ArtistManagement.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },
    
    handleButtonClick: async function(event) {
        event.preventDefault();
        App.getMetaskAccountID();
        var processId = parseInt($(event.target).data('id'));
		console.log('processId',processId);
		switch(processId) {
            case 1:
                return await App.addartist(event);
                break;
            case 2:
                return await App.addmusic(event);
				break;
			case 3:
				return await App.buymusic(event);
				break;
            case 4:
                return await App.addmanager(event);
                break;
            case 5:
                return await App.hiremanager(event);
                break;
            case 6:
                return await App.fetchArtist(event);
                break;
            case 7:
                return await App.fetchMusic(event);
				break;
			case 8:
				return await App.fetchManager(event);
				break;
            }

  },
  addartist: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data('id'));
    var resultTag = document.getElementById("isartist");
    App.contracts.ArtistManagement.deployed().then(function(instance) {
        resultTag.className = " loader";
          return instance.addartist(
              App.name,
              App.citizenship,
              App.age,
              {from: App.metamaskAccountID, gas:3000000}
          );
        }
    ).then(function(result) {
      resultTag.className = " font";
      resultTag.innerText = "  Tx Hash: "+result.tx;
        if (result == true){
            resultTag.style.color = "green"
        }else{
            resultTag.style.color = "red"

        }
    }).catch(function(err) {
      resultTag.className = " inputFeilds";
      resultTag.innerText = "  Error: "+err.message;

    });
},
addmusic: function (event) {
  event.preventDefault();
  var processId = parseInt($(event.target).data('id'));
  var price = document.getElementById("sellprice").value;
  var artistId = $("#artistId").val();
  var resultTag = document.getElementById("musicadded");
  App.contracts.ArtistManagement.deployed().then(function(instance) {
      resultTag.className = " loader";
      return instance.fetchArtist(artistId);
    }).then(function(result) {
      var artistId = result[3];
      var artist = result[4];
      App.contracts.ArtistManagement.deployed().then(function(instance) {
        return instance.addmusic(App.title, App.genre, price, artistId, {from: artist, gas: 3000000 });
      }).then(function(result) {
        resultTag.className = " font";
        resultTag.innerText = "  Tx Hash: "+result.tx;
    }).catch(function(err) {
        resultTag.className = " font";
        resultTag.innerText = "  Error: "+err.message;

    });
  }).catch(function(err) {
    resultTag.className = " font";
    resultTag.innerText = "  Error: "+err.message;

  });

},
	
	
	buymusic: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
		var musicId = document.getElementById("purchasemusicId").value;
		var artistId = document.getElementById("purchaseartistId").value;
        var resultTag = document.getElementById("pid");
        App.contracts.ArtistManagement.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.fetchMusic(musicId);
          }).then(function(result) {
            var MusicId = result[4];
            var price = result[3];
            var balance = window.web3.toWei(price, 'ether');
            App.contracts.ArtistManagement.deployed().then(function(instance) {
              return instance.buymusic(MusicId,artistId, {from: App.metamaskAccountID, value:balance });
            }).then(function(result) {
              resultTag.className = " font";
              resultTag.innerText = "  Tx Hash: "+result.tx;
          }).catch(function(err) {
              resultTag.className = " font";
              resultTag.innerText = "  Error: "+err.message;

          });
        }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;

        });

	},
	addmanager: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
		var resultTag = document.getElementById("manageradded");
		var salary = document.getElementById("hiresalary").value;
        App.contracts.ArtistManagement.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.addmanager(
				App.Name,
				salary,
                {from: App.metamaskAccountID, gas:3000000}
            );
        }).then(function(result) {
            resultTag.className = " font";
            resultTag.innerText = "  Tx Hash: "+result.tx;
        }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
        });
	},
	hiremanager: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
		var managerId = $("#ManagerId").val();
		var periodinmonths = document.getElementById("periodinmonths").value;
        var resultTag = document.getElementById("hire");
        App.contracts.ArtistManagement.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.fetchManager(managerId);
          }).then(function(result) {
            var salary = result[2];
            var managerId = result[3];
            var balance = window.web3.toWei(salary, 'ether');
            App.contracts.ArtistManagement.deployed().then(function(instance) {
              return instance.hiremanager(managerId,periodinmonths, {from: App.metamaskAccountID, value:balance*periodinmonths});
            }).then(function(result) {
              resultTag.className = " font";
              resultTag.innerText = "  Tx Hash: "+result.tx;
          }).catch(function(err) {
              resultTag.className = " font";
              resultTag.innerText = "  Error: "+err.message;

          });
        }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;

        });

	},
	fetchArtist: function () {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var displayTo = document.getElementById("BlockInfoArtist");
        var artistId = $('#artistId1').val();
        App.contracts.ArtistManagement.deployed().then(function(instance) {
          return instance.fetchArtist(artistId);
        }).then(function(result) {
          while (displayTo.firstChild) {
              displayTo.removeChild(displayTo.firstChild);
          }
          displayTo.innerHTML = (

          "Name: "+result[0]+"<br>"+
          "Citizenship: "+result[1]+"<br>"+
          "Age: "+result[2]+"<br>"+
          "Artist Id: "+result[3]+"<br>"+
          "Artist: "+result[4]
          );

        }).catch(function(err) {
          console.log(err.message);
        });
	},
	fetchMusic: function () {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var displayTo = document.getElementById("BlockInfoMusic");
        var musicId = $('#musicId1').val();
        App.contracts.ArtistManagement.deployed().then(function(instance) {
          return instance.fetchMusic(musicId);
        }).then(function(result) {
          while (displayTo.firstChild) {
              displayTo.removeChild(displayTo.firstChild);
          }
          displayTo.innerHTML = (

          "Name: "+result[0]+"<br>"+
          "Genre: "+result[1]+"<br>"+
          "Music State: "+result[2]+"<br>"+
          "Price "+result[3]+"<br>"+
		  "Music Id: "+result[4]+"<br>"+
		  "Buyer: "+result[5]
          );

        }).catch(function(err) {
          console.log(err.message);
        });
	},
	fetchManager: function () {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var displayTo = document.getElementById("BlockInfoManager");
        var managerId = $('#managerId1').val();
        App.contracts.ArtistManagement.deployed().then(function(instance) {
          return instance.fetchManager(managerId);
        }).then(function(result) {
          while (displayTo.firstChild) {
              displayTo.removeChild(displayTo.firstChild);
          }
          displayTo.innerHTML = (

          "Name: "+result[0]+"<br>"+
          "Address: "+result[1]+"<br>"+
          "Salary: "+result[2]+"<br>"+
          "Manager Id: "+result[3]
          );

        }).catch(function(err) {
          console.log(err.message);
        });
	},
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

