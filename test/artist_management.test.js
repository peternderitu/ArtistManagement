/*
The public version of the file used for testing can be found here: https://gist.github.com/ConsenSys-Academy/7d59ba6ebe581c1ffcc981469e226c6e
This test file has been updated for Truffle version 5.0. If your tests are failing, make sure that you are
using Truffle version 5.0. You can check this by running "truffle version"  in the terminal. If version 5 is not
installed, you can uninstall the existing version with `npm uninstall -g truffle` and install the latest version (5.0)
with `npm install -g truffle`.
*/
let BN = web3.utils.BN
let ArtistManagement = artifacts.require('ArtistManagement')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('ArtistManagement', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]
    const joy = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    const excessAmount  = "2000"

    const price = "1000"
    const salary = "2000"
    const name = "may"
    const citizenship = "cambodia"
    const age ="25"
    const genre = "hiphop"
    const artistId = "1"

    let instance

    beforeEach(async () => {
        instance = await ArtistManagement.new()
    })

    it("should add an artist with the provided name, citizenship and age", async() => {
        const tx = await instance.addartist(name, citizenship, age, {from: alice})
                
        const result = await instance.fetchArtist.call(1)

        assert.equal(result[0], name, 'the name of the last added artist does not match the expected value')
        assert.equal(result[1], citizenship, 'the citizenship of the last added artist does not match the expected value')
        assert.equal(result[2].toString(10), age, 'the age of the last added artist does not match the expected value')
        assert.equal(result[4], alice, 'the address adding the artist should be listed as the artist')
    })

    it("should emit a Logaddartist event when an artist is added", async()=> {
        let eventEmitted = false
        const tx = await instance.addartist(name, citizenship, age, {from: alice})
        
        if (tx.logs[0].event == "Logaddartist") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'adding an artist should emit a For Sale event')
    })
    it("should add music with the provided name, genre, price, artistId", async() => {
        await instance.addartist(name, citizenship, age, {from: alice})
        const tx = await instance.addmusic(name, genre, price, artistId, {from: alice})
                
        const result = await instance.fetchMusic.call(1)

        assert.equal(result[0], name, 'the name of the last added music does not match the expected value')
        assert.equal(result[1], genre, 'the genre of the last added genre does not match the expected value')
        assert.equal(result[2].toString(10), 0, 'the state of the music should be "For Sale", which should be declared first in the State Enum')
        assert.equal(result[3].toString(10), price, 'the price of the last added music does not match the expected value')
        assert.equal(result[5], emptyAddress, 'the buyer address should be set to 0 when an item is added')
    })

    it("should emit a Logaddmusic event when music is added", async()=> {
        let eventEmitted = false
        await instance.addartist(name, citizenship, age, {from: alice})
        const tx = await instance.addmusic(name, genre, price, artistId, {from: alice})
        
        if (tx.logs[0].event == "Logaddmusic") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'adding music should emit an add music event')
    })
    it("should emit a LogForSale event when music is added", async()=> {
        let eventEmitted = false
        await instance.addartist(name, citizenship, age, {from: alice})
        const tx = await instance.addmusic(name, genre, price, artistId, {from: alice})
        
        if (tx.logs[1].event == "LogForSale") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'adding music should emit a For Sale event')
    })


    it("should allow someone to purchase an item and update state accordingly", async() => {
        await instance.addartist(name, citizenship, age, {from: alice})
        await instance.addmusic(name,genre, price,artistId, {from: alice})
        var aliceBalanceBefore = await web3.eth.getBalance(alice)
        var bobBalanceBefore = await web3.eth.getBalance(bob)

        await instance.buymusic(1,1, {from: bob, value: excessAmount})

        var aliceBalanceAfter = await web3.eth.getBalance(alice)
        var bobBalanceAfter = await web3.eth.getBalance(bob)

        const result = await instance.fetchMusic.call(1)

        assert.equal(result[2].toString(10), 1, 'the state of the music should be "Sold", which should be declared second in the State Enum')
        assert.equal(result[5], bob, 'the buyer address should be set bob when he purchases the music')
        assert.equal(new BN(aliceBalanceAfter).toString(), new BN(aliceBalanceBefore).add(new BN(price)).toString(), "alice's balance should be increased by the price of the music")
        assert.isBelow(Number(bobBalanceAfter), Number(new BN(bobBalanceBefore).sub(new BN(price))), "bob's balance should be reduced by more than the price of the music (including gas costs)")
    })

    it("should error when not enough value is sent when purchasing music", async()=>{
        await instance.addartist(name, citizenship, age, {from: alice})
        await instance.addmusic(name,genre, price,artistId, {from: alice})
        await catchRevert(instance.buymusic(1,1, {from: bob, value: 1}))
    })

    it("should emit LogSold event when music is purchased", async()=>{
        var eventEmitted = false
        await instance.addartist(name, citizenship, age, {from: alice})
        await instance.addmusic(name,genre, price,artistId, {from: alice})
        const tx = await instance.buymusic(1,1, {from: bob, value: excessAmount})

        if (tx.logs[0].event == "LogSold") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'adding an item should emit a Sold event')
    })
})