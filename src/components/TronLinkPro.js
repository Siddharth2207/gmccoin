import React from 'react'
import TronLinkLogo from './assets/TronLinkLogo.png' 
import './TronLinkPro.css' 


function TronLinkPro(props) {  
   
    const logo = (
        <div className='logo'>
            <img src={ TronLinkLogo } alt='TronLink logo' />
        </div>
    ); 

    

    const Install = () =>{
        return(
            <div id="content">
                            <div className="title-main"> 
                                <h3 className="logo-text" style={{color: '#ffffff' ,  fontFamily: 'Oswald'}}> Install Tron Wallet </h3> 
                    
                            </div>
                            
                            <div className="header-content row">
                                <div className="content-heading col-sm-6">
                                    <div className="subheading">
                                    <h3 className="logo-text" style={{color: 'red' ,  fontFamily: 'Oswald' }}> 
                                    To create a post or tip others you must install TronLink. TronLink is a TRON wallet for the browser
                                    that can be installed as extension . 
                                    Once installed, return back and refresh the page.
                                    </h3>
                                    </div>
                                    
                                </div>
                                <div className="heading-logo col-sm-6">
                                    { logo }
                                </div>
                            </div>
                        </div>
        )
    } 

    const LogIn = () => {
        return (
            <div id="content">
            <div className="title-main"> 
                <h3 className="logo-text" style={{color: '#ffffff' ,  fontFamily: 'Oswald'}}> LogIn to your wallet </h3> 
            </div>
            
            <div className="header-content row">
                <div className="content-heading col-sm-6">
                    <div className="subheading">
                    <h3 className="logo-text" style={{color: 'red' ,  fontFamily: 'Oswald' }}> 
                         Wallet is installed but you must first log in. Open Wallet from the browser bar and set up your
                         first wallet or decrypt a previously-created wallet.
                    </h3>
                    </div>
                    
                </div>
                <div className="heading-logo col-sm-6">
                     { logo }
                </div>
            </div> 
            </div>
            )
    }
    
    return (
            <>
                {props.installed ? 
                    <LogIn /> 
                    : 
                    <Install />  
                  }
            </>
            
    )
}

export default TronLinkPro
