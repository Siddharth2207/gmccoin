import React, { useEffect, useState } from 'react'
import './Home.css' 
import logo2 from './assets/GMC_Logo_white_5k.jpg'  
import Swal from 'sweetalert2'
import TronLinkPro from './TronLinkPro'

function Home() { 

    const [address , setAddress] = useState('')  
    const [contract , setContract] = useState()  
    const [balance , setBalance] = useState() 
    const [profit , setProfit] = useState()  
    const [claim , setClaim] = useState()  
    const [accountBal , setAccountBal] = useState(0) 
    
    const [investAmt , setinvestAmt] = useState('') 
    const [withdrawAmt , setwithdrawAmt] = useState('')  
    const [installFLag , setInstallFlag ] = useState(true)
    const [logInFLag , setlogInFlag ] = useState(true) 
    
    

    useEffect(() => {      

            let timerInterval
            Swal.fire({
            title: 'Loading!',
            html: '<h3>Please wait </h3>',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                const content = Swal.getHtmlContainer()
                if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                    b.textContent = Swal.getTimerLeft()
                    }
                }
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
            }) 

        
        setTimeout(async () =>{   

            if(window.tronWeb !== undefined){
                if(window.tronWeb.defaultAddress.base58  ) {  
                    try {
                        setInstallFlag(true) 
                        setlogInFlag(true)
                        setAddress(window.tronWeb.defaultAddress.base58) //TR9o7SXc9KqPrAxuBVb1gHMCykybxTK3GR 
                        let instance = await window.tronWeb.contract().at('TAx8Jq65YhvXc5saxFsqfLzKEwbQ1EdK64'); 
                        setContract(instance)      
                        const account = await window.tronWeb.trx.getAccount(window.tronWeb.defaultAddress.base58)  
                        
                        if(account.assetV2){  
                            const temBal = account.assetV2.find(asset => asset.key === '1002357') 
                            if(temBal ){  
                                setAccountBal(temBal.value/100)
                            }else{
                                setAccountBal(0)
                            }
                        }else{
                            setAccountBal(0)
                        }
                         
                        let bal = await instance.balanceOf( window.tronWeb.defaultAddress.base58).call()  
                        setBalance(bal.toNumber() / 100 ) 
    
                        let prof = await instance.rewardscheck( window.tronWeb.defaultAddress.base58).call()   
                        setProfit(prof.toNumber() / 100 ) 
                        
                        let clamt = await instance.checkClaim().call()   
                        setClaim(clamt.toNumber() / 100 ) 

                        Swal.hideLoading()  
                        
                    } catch (error) {
                        const msg = error.message ? error.message : error  
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: `${msg}`,
                                
                        })
                    }
                }else{ 
                    setInstallFlag(true) 
                    setlogInFlag(false)
                }
            } else{
                setInstallFlag(false) 
                setlogInFlag(false)
            }
        } , 3000)    

    } , [])  

    const investButtonClick = async () => {  
    
        try { 
            if(investAmt === 0 || investAmt < 0 || isNaN(investAmt) ){
                Swal.fire({
                    icon: 'info',
                    text: `Amount must be greater than zero`, 
                  })
            }else{  
                if(investAmt > accountBal){
                    Swal.fire({
                        icon: 'info',
                        text: `Insufficient funds in wallet `, 
                      })
                }else{
                    Swal.showLoading()  
                    await contract.deposit().send({
                        feeLimit:100_000_000,
                        callValue:0,
                    tokenId:1002357,
                    tokenValue: investAmt * 100 ,
                    shouldPollResponse:true
                    });    
        
                    Swal.fire({
                        icon: 'success',
                        title: 'Success'
                        }).then(res => {
                            window.location.reload()
                        })

                }

            }           
        } catch (error) {  
                const msg = error.message ? error.message : error  
              
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${msg}`, 
                  }).then(res => {
                    window.location.reload()
                })
        
        }        
    } 

    const withdrawButtonClick = async () => { 
 
        try {  

            if(withdrawAmt <= 0 || isNaN(withdrawAmt)) {
                Swal.fire({
                    icon: 'info',
                    text: `Amount must be greater than zero`, 
                  })
            }
            else{ 

                if(withdrawAmt > balance){
                    Swal.fire({
                        icon: 'info',
                        text: `Amount must be less than invested amount`, 
                      })
                }else{  
                    if(claim > 0 ){
                        Swal.fire({
                            icon: 'info',
                            text: `Please wait until you have claimed your previous withdrawl`, 
                          })
                    }else{
                        Swal.showLoading() 
                        await contract.withdraw(withdrawAmt * 100).send({
                                        feeLimit:100_000_000,
                                        callValue:0,
                                    shouldPollResponse:true
                                    });   
            
                        Swal.fire({
                            icon: 'success',
                            title: 'Success'  , 
                            text : 'Withdrawl successful.You will be able to claim your amount in four days . '
    
                            }).then(res => {
                                window.location.reload()
                            })
                
                       
                    }
                }

            }

        } catch (error) {  
                const msg = error.message ? error.message : error  

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${msg}`,
                  }).then(res => {
                    window.location.reload()
                })
        }   
    } 

    const withdrawRewards  = async () => {
        try{ 
            if(profit <= 0){
                Swal.fire({
                    icon: 'info',
                    title: 'No rewards to be claimed'
                    })            
            }else{
                Swal.showLoading() 

                 await contract.getRewards().send({
                    feeLimit:100_000_000,   
                    callValue:0,
                    shouldPollResponse:true
                });   

                Swal.fire({
                    icon: 'success',
                    title: 'Success'
                    }).then(res => {
                        window.location.reload()
                    }) 
            }

        }catch(error){
            const msg = error.message ? error.message : error  

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${msg}`,
            }).then(res => {
                window.location.reload()
            })
        }
    } 

    const claimAmount = async () => { 
        
        try{ 

            if(claim <= 0 ){
                Swal.fire({
                    icon: 'info',
                    title: 'No claim to be made'
                })
            }else{ 
                let time = await contract.checkTimeOf().call()
 

                if(time.toNumber() + 345600 > Math.floor(Date.now() / 1000) ) { 
                    const rem = ( (time.toNumber() + 345600) - Math.floor(Date.now() / 1000) ) / 3600  
                    Swal.fire({
                            icon: 'info',
                            title: `Please wait for ${rem} hours for claim period to end .`
                            }) 
                }else{

                        Swal.showLoading() 

                         await contract.claim().send({
                            feeLimit:100_000_000,
                            callValue:0,
                            shouldPollResponse:true
                        });   
            
                        Swal.fire({
                            icon: 'success',
                            title: 'Success'
                            }).then(res => {
                                window.location.reload()
                            })     
                }                 
            }
        }catch(error){
            const msg = error.message ? error.message : error  
 
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${msg}`,
            }).then(res => {
                window.location.reload()
            })
        }
    }
    
    return (   
        <>
            {
                installFLag ?
                 <>
                 {
                     logInFLag ? 
                     (
                        <div>
                            <div id="content">
                                <div className="title-main">
                                    <h3 className="logo-text" style={{color: '#ffffff' ,  fontFamily: 'Oswald'}}> Stake GMC </h3> 
                                    
                                </div>
                                
                                <div className="header-content row">
                                    <div className="content-heading col-sm-6">
                                        <div className="subheading">
                                            <h2>Earn on Smart Contract</h2>
                                                <h5>Get Daily ROI on Investment.</h5>
                                                <h5>Decentralized Investment Fund with
                                                    an Open Smart Contract.</h5>
                                                <button className="btn-hover color-1"><a href="#invest_options" style={{textDecoration: "none !important" , color:"#2e065a"}} className="invest-btn-text">Get Daily Returns</a></button>
                                        </div>
                                        
                                    </div>
                                    <div className="heading-logo col-sm-6">
                                        <img src={logo2} style= {{borderRadius : '50%'}} alt="logo" className="responsive" height="200px" />
                                    </div>
                                </div>
                            </div>   

                            <div className="user-info container-fluid" data-aos="fade-up">
                                <h2>User Information</h2>
                                <table align="center" className="table-style"> 
                                    <tbody>
                                    <tr>
                                        <td>Account Address : </td>
                                        <td className="purple" >{address.toString().substring(0,4) + "...." + address.toString().substring(30,34)  || ''}</td>
                                    </tr> 
                                    <tr>
                                        <td>Account Balance :</td>
                                        <td className="purple" >{accountBal || '0'} GMC</td>
                                    </tr>
                                    <tr>
                                        <td>Total Invested Amount :</td>
                                        <td className="purple" >{balance || '0' } GMC</td>
                                    </tr>
                                    <tr>
                                        <td>Total Profit :</td>
                                        <td className="purple" >{profit || '0'} GMC</td>
                                    </tr> 
                                    
                                    </tbody>
                                </table>
                            </div>   

                            <div className="investment-plan" data-aos="fade-up">
                                <div className="investment-plan-heading">
                                    <h2>Investment Plans</h2>
                                </div>
                                <div className="row">
                                    <div className="plan-details col-sm-6 card1 card-bg">
                                        <h4>Plan details</h4>
                                        <h5>Earn daily profit</h5>
                                        <h5><i className="fa fa-check" aria-hidden="true"></i> High Profit Factor</h5>
                                        <h5><i className="fa fa-check" aria-hidden="true"></i> Withdraw Profit Anytime</h5>
                                        <h5><i className="fa fa-check" aria-hidden="true"></i> Over 6% APY</h5>
                                    </div>
                                    <div className="amount-details card1 card-bg col-sm-6">
                                        <h4>Enter Investment amount</h4>
                                        <div className="input-box">
                                            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNTZweCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjIxIDI1NiIgd2lkdGg9IjIyMXB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZXNjLz48ZGVmcy8+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0iQ2xhc3NpYyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGZpbGw9IiMwQzBFMEYiIGlkPSJUUk9OIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAwLjAwMDAwMCwgLTMyNzkuMDAwMDAwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLjAwMDAwMCwgMzI3OS4wMDAwMDApIj48cGF0aCBkPSJNMTA2LjE0NjkzNCwxMjEuMzIyNjI0IEwxNS4xMjAxNjksMTEuNTU2NzgzIEwxNzMuMTM1NzU3LDQ5Ljg4MzQ0OTMgTDEwNi4xNDY5MzQsMTIxLjMyMjYyNCBaIE0xMTYuNTQ0NDIxLDExOC40NzQzMzggTDE3OC42NzgxMjIsNTEuNzM5MzIyMyBMMjA2Ljc3NTA1LDcxLjM2Mjk2MTIgTDExNi41NDQ0MjEsMTE4LjQ3NDMzOCBaIE0xODAuNTkzNjgzLDQyLjU4MzgzMDYgQzY5LjQ4MTg1NjMsMTUuMzA4NTk0OCAxMS41MjI4NzA2LDEuMTk0MjkwMzQgNi43MTY3MjYxNywwLjI0MDkxNzMxNyBDLTAuNDkyNDkwNDA0LC0xLjE4OTE0MjIyIC0wLjMzNTA5NTEyNiw0LjEyOTcyNTcgMC4yNTM1Mzc0NjQsNi4xNDA5MzYwMSBDMC44NDIxNzAwNTQsOC4xNTIxNDYzMyA4OC4wNDIzODMsMjUwLjIzMDM5NyA4OS4yMTU0OTIzLDI1My40OTk1NTcgQzkwLjM4ODYwMTYsMjU2Ljc2ODcxNiA5NS4wNDM3NDIzLDI1Ni44OTc2MjMgOTcuNDM4MzczMywyNTMuNDk5NTU3IEM5OS4wMzQ3OTQsMjUxLjIzNDE3OSAxMzkuNjgxOCwxOTIuMTY1NDEzIDIxOS4zNzkzOTIsNzYuMjkzMjU5NyBDMjIwLjM4MDk5Niw3NC44NTQ4ODE4IDIyMC45NjE0MjMsNzAuMzQ5NjI2MSAyMTcuODM5MDk1LDY4LjMwMzk3NjIgQzIxNC43MTY3NjYsNjYuMjU4MzI2MiAxODIuMjYzODI4LDQzLjEyMDU1ODkgMTgwLjU5MzY4Myw0Mi41ODM4MzA2IFogTTk2LjY0MzM4MzQsMjM5LjI1MjI4MSBMMTA4LjAyMjY2MSwxMjguOTEwNjc1IEwyMDcuODcwOTAxLDc3LjE1NzU3MDkgTDk2LjY0MzM4MzQsMjM5LjI1MjI4MSBaIE03LjcxMzQwNDk1LDExLjE5OTM0NCBMMTAyLjkwMTEzNywxMjUuODg2MjQ4IEw5MC43NTE0MjU0LDI0MS43NDM3MDcgTDcuNzEzNDA0OTUsMTEuMTk5MzQ0IFoiIGlkPSJMb2dvIi8+PC9nPjwvZz48L2c+PC9zdmc+" height="25px" alt="Tron Logo" />
                                            <input type="text" className="p-1 border"  placeholder="100" value = {investAmt} onChange = {(e) => setinvestAmt(e.target.value)}/>
                                        </div> 
                                        <h5 className="trx-text">GMC</h5>
                                        <button className="btn-hover color-1"  onClick = {investButtonClick}><p className="invest-btn-text">Invest Now</p></button>
                                        <p className="input-box-d">Make sure you have enough energy in your wallet</p>
                                    </div>
                                </div>
                            </div> 

                            <div className="user-info bg-color">
                                <h2>Withdraw section</h2>
                                <div className="row" data-aos="fade-up">
                                    <div className="amount-details card1 card-bg col-sm-6">
                                        <h4>Enter  amount</h4>
                                        <div className="input-box">
                                            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNTZweCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjIxIDI1NiIgd2lkdGg9IjIyMXB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZXNjLz48ZGVmcy8+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0iQ2xhc3NpYyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGZpbGw9IiMwQzBFMEYiIGlkPSJUUk9OIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAwLjAwMDAwMCwgLTMyNzkuMDAwMDAwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLjAwMDAwMCwgMzI3OS4wMDAwMDApIj48cGF0aCBkPSJNMTA2LjE0NjkzNCwxMjEuMzIyNjI0IEwxNS4xMjAxNjksMTEuNTU2NzgzIEwxNzMuMTM1NzU3LDQ5Ljg4MzQ0OTMgTDEwNi4xNDY5MzQsMTIxLjMyMjYyNCBaIE0xMTYuNTQ0NDIxLDExOC40NzQzMzggTDE3OC42NzgxMjIsNTEuNzM5MzIyMyBMMjA2Ljc3NTA1LDcxLjM2Mjk2MTIgTDExNi41NDQ0MjEsMTE4LjQ3NDMzOCBaIE0xODAuNTkzNjgzLDQyLjU4MzgzMDYgQzY5LjQ4MTg1NjMsMTUuMzA4NTk0OCAxMS41MjI4NzA2LDEuMTk0MjkwMzQgNi43MTY3MjYxNywwLjI0MDkxNzMxNyBDLTAuNDkyNDkwNDA0LC0xLjE4OTE0MjIyIC0wLjMzNTA5NTEyNiw0LjEyOTcyNTcgMC4yNTM1Mzc0NjQsNi4xNDA5MzYwMSBDMC44NDIxNzAwNTQsOC4xNTIxNDYzMyA4OC4wNDIzODMsMjUwLjIzMDM5NyA4OS4yMTU0OTIzLDI1My40OTk1NTcgQzkwLjM4ODYwMTYsMjU2Ljc2ODcxNiA5NS4wNDM3NDIzLDI1Ni44OTc2MjMgOTcuNDM4MzczMywyNTMuNDk5NTU3IEM5OS4wMzQ3OTQsMjUxLjIzNDE3OSAxMzkuNjgxOCwxOTIuMTY1NDEzIDIxOS4zNzkzOTIsNzYuMjkzMjU5NyBDMjIwLjM4MDk5Niw3NC44NTQ4ODE4IDIyMC45NjE0MjMsNzAuMzQ5NjI2MSAyMTcuODM5MDk1LDY4LjMwMzk3NjIgQzIxNC43MTY3NjYsNjYuMjU4MzI2MiAxODIuMjYzODI4LDQzLjEyMDU1ODkgMTgwLjU5MzY4Myw0Mi41ODM4MzA2IFogTTk2LjY0MzM4MzQsMjM5LjI1MjI4MSBMMTA4LjAyMjY2MSwxMjguOTEwNjc1IEwyMDcuODcwOTAxLDc3LjE1NzU3MDkgTDk2LjY0MzM4MzQsMjM5LjI1MjI4MSBaIE03LjcxMzQwNDk1LDExLjE5OTM0NCBMMTAyLjkwMTEzNywxMjUuODg2MjQ4IEw5MC43NTE0MjU0LDI0MS43NDM3MDcgTDcuNzEzNDA0OTUsMTEuMTk5MzQ0IFoiIGlkPSJMb2dvIi8+PC9nPjwvZz48L2c+PC9zdmc+" height="25px" alt="Tron Logo" />
                                            <input type="text" className="p-1 border"  placeholder="100" value={withdrawAmt} onChange = {(e) => setwithdrawAmt(e.target.value)} />
                                        </div> 
                                        <h5 className="trx-text">GMC</h5>
                                        <button className="btn-hover color-1"  onClick = {withdrawButtonClick}><p className="invest-btn-text">Withdraw</p></button>
                                        <p className="input-box-d"> Make sure you have enough energy in your wallet </p>
                                    </div> 

                                    <div className="amount-details card1 card-bg col-sm-6"> 
                                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNTZweCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjIxIDI1NiIgd2lkdGg9IjIyMXB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZXNjLz48ZGVmcy8+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0iQ2xhc3NpYyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGZpbGw9IiMwQzBFMEYiIGlkPSJUUk9OIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAwLjAwMDAwMCwgLTMyNzkuMDAwMDAwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLjAwMDAwMCwgMzI3OS4wMDAwMDApIj48cGF0aCBkPSJNMTA2LjE0NjkzNCwxMjEuMzIyNjI0IEwxNS4xMjAxNjksMTEuNTU2NzgzIEwxNzMuMTM1NzU3LDQ5Ljg4MzQ0OTMgTDEwNi4xNDY5MzQsMTIxLjMyMjYyNCBaIE0xMTYuNTQ0NDIxLDExOC40NzQzMzggTDE3OC42NzgxMjIsNTEuNzM5MzIyMyBMMjA2Ljc3NTA1LDcxLjM2Mjk2MTIgTDExNi41NDQ0MjEsMTE4LjQ3NDMzOCBaIE0xODAuNTkzNjgzLDQyLjU4MzgzMDYgQzY5LjQ4MTg1NjMsMTUuMzA4NTk0OCAxMS41MjI4NzA2LDEuMTk0MjkwMzQgNi43MTY3MjYxNywwLjI0MDkxNzMxNyBDLTAuNDkyNDkwNDA0LC0xLjE4OTE0MjIyIC0wLjMzNTA5NTEyNiw0LjEyOTcyNTcgMC4yNTM1Mzc0NjQsNi4xNDA5MzYwMSBDMC44NDIxNzAwNTQsOC4xNTIxNDYzMyA4OC4wNDIzODMsMjUwLjIzMDM5NyA4OS4yMTU0OTIzLDI1My40OTk1NTcgQzkwLjM4ODYwMTYsMjU2Ljc2ODcxNiA5NS4wNDM3NDIzLDI1Ni44OTc2MjMgOTcuNDM4MzczMywyNTMuNDk5NTU3IEM5OS4wMzQ3OTQsMjUxLjIzNDE3OSAxMzkuNjgxOCwxOTIuMTY1NDEzIDIxOS4zNzkzOTIsNzYuMjkzMjU5NyBDMjIwLjM4MDk5Niw3NC44NTQ4ODE4IDIyMC45NjE0MjMsNzAuMzQ5NjI2MSAyMTcuODM5MDk1LDY4LjMwMzk3NjIgQzIxNC43MTY3NjYsNjYuMjU4MzI2MiAxODIuMjYzODI4LDQzLjEyMDU1ODkgMTgwLjU5MzY4Myw0Mi41ODM4MzA2IFogTTk2LjY0MzM4MzQsMjM5LjI1MjI4MSBMMTA4LjAyMjY2MSwxMjguOTEwNjc1IEwyMDcuODcwOTAxLDc3LjE1NzU3MDkgTDk2LjY0MzM4MzQsMjM5LjI1MjI4MSBaIE03LjcxMzQwNDk1LDExLjE5OTM0NCBMMTAyLjkwMTEzNywxMjUuODg2MjQ4IEw5MC43NTE0MjU0LDI0MS43NDM3MDcgTDcuNzEzNDA0OTUsMTEuMTk5MzQ0IFoiIGlkPSJMb2dvIi8+PC9nPjwvZz48L2c+PC9zdmc+" height="25px" alt="Tron Logo" />
                                        <h4><b>Total Rewards : {profit} </b></h4>
                                        
                                        
                                        <button className="btn-hover color-1" ><p className="invest-btn-text" onClick = {withdrawRewards}>Withdraw Rewards</p></button>
                                        <p className="input-box-d"> Make sure you have enough energy in your wallet </p>
                                    </div> 

                                    <div className="amount-details card1 card-bg col-sm-6"> 
                                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNTZweCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjIxIDI1NiIgd2lkdGg9IjIyMXB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZXNjLz48ZGVmcy8+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBpZD0iQ2xhc3NpYyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGZpbGw9IiMwQzBFMEYiIGlkPSJUUk9OIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAwLjAwMDAwMCwgLTMyNzkuMDAwMDAwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLjAwMDAwMCwgMzI3OS4wMDAwMDApIj48cGF0aCBkPSJNMTA2LjE0NjkzNCwxMjEuMzIyNjI0IEwxNS4xMjAxNjksMTEuNTU2NzgzIEwxNzMuMTM1NzU3LDQ5Ljg4MzQ0OTMgTDEwNi4xNDY5MzQsMTIxLjMyMjYyNCBaIE0xMTYuNTQ0NDIxLDExOC40NzQzMzggTDE3OC42NzgxMjIsNTEuNzM5MzIyMyBMMjA2Ljc3NTA1LDcxLjM2Mjk2MTIgTDExNi41NDQ0MjEsMTE4LjQ3NDMzOCBaIE0xODAuNTkzNjgzLDQyLjU4MzgzMDYgQzY5LjQ4MTg1NjMsMTUuMzA4NTk0OCAxMS41MjI4NzA2LDEuMTk0MjkwMzQgNi43MTY3MjYxNywwLjI0MDkxNzMxNyBDLTAuNDkyNDkwNDA0LC0xLjE4OTE0MjIyIC0wLjMzNTA5NTEyNiw0LjEyOTcyNTcgMC4yNTM1Mzc0NjQsNi4xNDA5MzYwMSBDMC44NDIxNzAwNTQsOC4xNTIxNDYzMyA4OC4wNDIzODMsMjUwLjIzMDM5NyA4OS4yMTU0OTIzLDI1My40OTk1NTcgQzkwLjM4ODYwMTYsMjU2Ljc2ODcxNiA5NS4wNDM3NDIzLDI1Ni44OTc2MjMgOTcuNDM4MzczMywyNTMuNDk5NTU3IEM5OS4wMzQ3OTQsMjUxLjIzNDE3OSAxMzkuNjgxOCwxOTIuMTY1NDEzIDIxOS4zNzkzOTIsNzYuMjkzMjU5NyBDMjIwLjM4MDk5Niw3NC44NTQ4ODE4IDIyMC45NjE0MjMsNzAuMzQ5NjI2MSAyMTcuODM5MDk1LDY4LjMwMzk3NjIgQzIxNC43MTY3NjYsNjYuMjU4MzI2MiAxODIuMjYzODI4LDQzLjEyMDU1ODkgMTgwLjU5MzY4Myw0Mi41ODM4MzA2IFogTTk2LjY0MzM4MzQsMjM5LjI1MjI4MSBMMTA4LjAyMjY2MSwxMjguOTEwNjc1IEwyMDcuODcwOTAxLDc3LjE1NzU3MDkgTDk2LjY0MzM4MzQsMjM5LjI1MjI4MSBaIE03LjcxMzQwNDk1LDExLjE5OTM0NCBMMTAyLjkwMTEzNywxMjUuODg2MjQ4IEw5MC43NTE0MjU0LDI0MS43NDM3MDcgTDcuNzEzNDA0OTUsMTEuMTk5MzQ0IFoiIGlkPSJMb2dvIi8+PC9nPjwvZz48L2c+PC9zdmc+" height="25px" alt="Tron Logo" />
                                        <h4><b>Claim Amount : {claim} </b></h4>
                                        <button className="btn-hover color-1"  ><p className="invest-btn-text" onClick = {claimAmount} >Claim Amount</p></button>
                                        <p className="input-box-d"> Make sure you have enough energy in your wallet </p>
                                    </div>
                            
                                </div> 
                            </div> 

                            <footer className="site-footer bg-color" style={{backgroundColor:"#2e065a" ,  color: "#ffffff"}} data-aos="fade-up">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-8 col-sm-6 col-xs-12">
                                            <p className="copyright-text">Copyright &copy; All Rights Reserved
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </div>
                     ) : 
                     <TronLinkPro installed={true}/>
                 }
                 </> 
                 : 
                <TronLinkPro />
            }
        </>
    )
}

export default Home
