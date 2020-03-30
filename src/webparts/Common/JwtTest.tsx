import * as React from 'react';
import {
    withRouter
  } from 'react-router-dom'
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import Cookies from 'universal-cookie';
import TestGrid from '../koreanWorkFlow/components/Grid/TestGrid';
import { IOverflowSetItemProps, CommandBarButton } from 'office-ui-fabric-react';
import styles from '../koreanWorkFlow/components/KoreanWorkFlow.module.scss';

export class JwtTest extends React.Component<any,any>{

    constructor(props){
        super(props);

        this.state = { 
            logginStatus: true, data:[]
            ,isOpen:false
            ,jwtData:[] as any[]
            ,jwtToken:''
            ,errorStr:''
            };
            
          
             this.warn = this.warn.bind(this);
             this.logout = this.logout.bind(this);
             this.resetTimeout = this.resetTimeout.bind(this);
          
             for (var i in this.events) {
          
               window.addEventListener(this.events[i], this.resetTimeout);
             }
          
             this.setTimeout();
          
            }
          
             _onLinkClick(ev: React.MouseEvent<HTMLElement>, item?: INavLink) {
              if (item && item.name === 'News') {
                alert('News link clicked');
              }
            }
          
            events = [
              "load",
              "mousemove",
              "mousedown",
              "click",
              "scroll",
              "keypress"
            ];
          
          
          
            warnTimeout = setTimeout(this.warn, 5 * 1000);
            logoutTimeout = setTimeout(()=>{this.handleLogOut()}, 10 * 1000);
          
            clearTimeout() {
              if (this.warnTimeout) clearTimeout(this.warnTimeout);
              if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
            }
          
            setTimeout() {
              const logout = this.logout;
              this.warnTimeout = setTimeout(this.warn, 5 * 1000);
              this.logoutTimeout = setTimeout(()=>{this.handleLogOut()}, 10 * 1000);
            }
          
            resetTimeout() {
              this.clearTimeout();
              this.setTimeout();
            }
          
            warn() {
              console.log("You will be logged out automatically in 1 minute.");
            }
          
            logout(){
          
              this.handleLogOut();
             
            }
          
            handleLogOut = ()=>{
          
               // Send a logout request to the API
               console.log("Sending a logout request to the API...")
          
               this.setState({  
                 logginStatus: false
               }) ;
           
               const cookies = new Cookies();
               cookies.set('testKey',null,{ path: '/' })
           
               // this.destroy(); // Cleanup
          
            }
          
            destroy() {
              this.clearTimeout();
          
              for (var i in this.events) {
                window.removeEventListener(this.events[i], this.resetTimeout);
              }
            }
          
            public testWebService(){
          
          
            }
          
          
            public getAuthenication = (e):Promise<any> =>{
          
              console.log("start")
          
            const sAddrforSVC = "";
            
            let resultfromSAP = {};               
          
            return fetch('https://kor1vmiisqa01/mirinae/api/login?username=admin&pass=123',{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
              })
              .then(function (response) {      
                return response.json()
              })
              .then(data => {
          
                console.log(data);
          
                const cookies = new Cookies();
                cookies.set('testKey',data.token,{ path: '/' });
                
                this.setState({
                  jwtToken: data.token,
                  logginStatus:true
                });
          
              })
              .catch(function (error) {
           
              });
            }
          
            public callWebServiceWithJWT = (e):Promise<any> => {
          
              console.log("Testetwe");
              debugger;
          
              const cookies = new Cookies();
              let token = cookies.get('testKey');
              return fetch('https://kor1vmiisqa01/mirinae/api/login/getvalue',{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
              })
              .then(function (response) {      
                return response.json()
              })
              .then(data => {
          
                this.setState({
                  jwtData: data
                });
          
                console.log(data);
          
          
              })
              .catch(function (error) {
           
              });
              
              
            }
          
            public callWebService  = (e):Promise<any> => {
          
          
              console.log("Testetwe");
          
              const cookies = new Cookies();
              let token = cookies.get('testKey');
              return fetch('https://kor1vmiisqa01/mirinae/api/login/getvalue',{
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
              })
              .then(function (response) {      
                return response.json()
              })    
              .catch((error) => {
          
                debugger;
          
                this.setState({
                  errorStr:JSON.stringify(error)
                })
           
              })    
              .then(data => {
          
                console.log(data);
              })
          
              
              
            }
          
            public callSpoWebService  = (e):Promise<any> => {
          
          
              console.log("Testetwe");
          
              const cookies = new Cookies();
          
              let targetCookies = cookies.getAll();
              let strCookies = "";
          
              for (var props in targetCookies) {
          
                if ( targetCookies[props] != null){
                  
                  strCookies +=  props +"="+ targetCookies[props] + "; "
                }                                          
            }   
          
              console.log(cookies);
              console.log(strCookies);
              console.log(cookies.getAll());
          
              console.log( `{${JSON.stringify({fromClientCookie:strCookies})}}`);
              
          
              let token = cookies.get('testKey');
              return fetch('https://localhost:44311/api/SharePoint/upload2',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',          
                },
                /* body:
                  `"'clientCooke':'${strCookies}'"` */
          
                body:
                  `"${strCookies}"`
              })
              .then(function (response) {      
                return response.json()
              })    
              .catch((error) => {
          
                debugger;
          
                this.setState({
                  errorStr:JSON.stringify(error)
                })
           
              })    
              .then(data => {
          
                console.log(data);
              })
          
              
              
            }
          
            private _onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
              return (
                <CommandBarButton
                  role="menuitem"
                  aria-label={item.name}
                  styles={{ root: { padding: '10px' } }}
                  iconProps={{ iconName: item.icon }}
                  onClick={item.onClick}
                />
              );
            };
          
            private _onRenderOverflowButton = (overflowItems: any[] | undefined): JSX.Element => {
              return (
                <CommandBarButton
                  role="menuitem"
                  title="More items"
                  styles={{ root: { padding: '10px' }, menuIcon: { fontSize: '16px' } }}
                  menuIconProps={{ iconName: 'More' }}
                  menuProps={{ items: overflowItems! }}
                />
              );
            };
          
            noOp = () => undefined;
          
            componentDidUpdate(prevProps, prevState, snapshot) {
          
              console.log("RequestFrom_componentDidUpdate");       
              console.log(this.state);        
            }
          
            dismissPanel =() =>{
              this.setState({
                isOpen:false
              })
          
            }
          
            openPanel =() =>{
              this.setState({
                isOpen:true
              })
          
            }

    public render(){

        const {jwtData,jwtToken,errorStr,logginStatus} = this.state;

        let datafromServer:any[] = jwtData;

        return (
            <div>
              <span className={ styles.title }>Welcome to SharePoint!!!!!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>

              <TestGrid></TestGrid>
             
              <button onClick={
                this.getAuthenication
              }>Authenication</button>

              <button onClick={
                this.callWebServiceWithJWT
              }>call Authorized web with jwt token </button>

              <button onClick={
                this.callWebService
              }>call Authorized web without jwt token </button>


              
              <button onClick={
                this.callSpoWebService
              }> call spo web servcie </button>

            <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
             <p>jwtToken :</p>
            <p>{jwtToken}</p>
            <br></br>
            <p>data from server :</p>

            {datafromServer.map((p,i)=>            
              <div>
              <p>{p}</p><br></br>
              </div>
          )}

          <p>error :</p>
          <p>{errorStr}</p>
          <p>loginstatus :</p>
          <p>{logginStatus === true? 'true':'false'}</p>

          
            </div>

            </div>
        );
    }
}
export default withRouter(JwtTest);