import React, { useEffect } from 'react'
import TronLinkLogo from './assets/TronLinkLogo.png' 
import './TronLinkPro.css' 


function TronLinkPro(props) {  
   
    const WEBSTORE_URL = 'https://chrome.google.com/webstore/detail/ibnejdfjmmkpcnlpebklmnkoeoihofec/';

    const logo = (
        <div className='logo'>
            <img src={ TronLinkLogo } alt='TronLink logo' />
        </div>
    ); 

    const openTronLink = () => {
        window.open(WEBSTORE_URL, '_blank');
    }; 

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
                                that can be <a href={ WEBSTORE_URL } target='_blank' rel='noopener noreferrer'>installed from the Chrome Webstore</a>.
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
                         TronLink is installed but you must first log in. Open TronLink from the browser bar and set up your
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
