import * as  React  from 'react';
import styles from './KoreanWorkFlow.module.scss';
import { IKoreanWorkFlowProps } from './IKoreanWorkFlowProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { lazy, Suspense }from 'react';
import Cookies from 'universal-cookie';
import { values } from 'office-ui-fabric-react/lib/Utilities';
import {Nav, INavLinkGroup} from 'office-ui-fabric-react/lib/Nav';
import { CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { IOverflowSetItemProps, OverflowSet } from 'office-ui-fabric-react/lib/OverflowSet';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { ContextualMenuItemType, IContextualMenuItem, DirectionalHint } from 'office-ui-fabric-react/lib/ContextualMenu';
import { IconButton, IIconProps, IContextualMenuProps, Stack, IconNames } from 'office-ui-fabric-react';
import '../Assets/KoreaCommon.css';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useConstCallback } from '@uifabric/react-hooks';
import {TestGrid} from './Grid/TestGrid'
import {TransactionTest} from './Transaction/TransactionTest'
import {TransactionTestPage} from './Transaction/TransactionTestPage'

import {
  BrowserRouter as Router,
  Route,
  HashRouter,
  Link,
  Switch
} from 'react-router-dom'
import { JwtTest } from '../../Common/JwtTest';

/* const [isBeakVisible, setIsBeakVisible] = React.useState(false);
const [useDirectionalHintForRTL, setUseDirectionalHintForRTL] = React.useState(false);
const [directionalHint, setDirectionalHint] = React.useState<DirectionalHint>(DirectionalHint.bottomLeftEdge);
const [directionalHintForRTL, setDirectionalHintForRTL] = React.useState<DirectionalHint>(DirectionalHint.bottomLeftEdge);

const onShowBeakChange = useConstCallback((event: React.FormEvent<HTMLElement>, isVisible: boolean): void => {
  setIsBeakVisible(isVisible);
});

const onUseRtlHintChange = useConstCallback((event: React.FormEvent<HTMLElement>, isVisible: boolean): void => {
  setUseDirectionalHintForRTL(isVisible);
});

const onDirectionalChanged = useConstCallback((event: React.FormEvent<HTMLDivElement>, option: IDropdownOption): void => {
  setDirectionalHint(option.key as DirectionalHint);
});

const onDirectionalRtlChanged = useConstCallback((event: React.FormEvent<HTMLDivElement>, option: IDropdownOption): void => {
  setDirectionalHintForRTL(option.key as DirectionalHint);
});
 */

/* const menuProps: IContextualMenuProps = React.useMemo(
  () => ({
    isBeakVisible: isBeakVisible,
    directionalHint: directionalHint,
    directionalHintForRTL: useDirectionalHintForRTL ? directionalHintForRTL : undefined,
    gapSpace: 0,
    beakWidth: 20,
    directionalHintFixed: false,
    items: menuItems
  }),
  [isBeakVisible, directionalHint, directionalHintForRTL]
); */
const menuItems: IContextualMenuItem[] = [
  {
    
    key: 'section1',
    itemType: ContextualMenuItemType.Section,
    sectionProps: {
      topDivider: true,
      bottomDivider: true,
      title: 'Actions',
      items: [
        {
          key: 'newItem',
          text: 'New'
        },
        {
          key: 'deleteItem',
          text: 'Delete'
        },
        {
          key: 'section2',
          itemType: ContextualMenuItemType.Section,
          sectionProps: {
            title: 'Social',
            items: [
              {
                key: 'share',
                text: 'Share'
              },
              {
                key: 'print',
                text: 'Print'
              },
              {
                key: 'music',
                text: 'Music'
              }
            ]
          }
        }

      ]
    }
  },
  {
    key: 'section2',
    itemType: ContextualMenuItemType.Section,
    sectionProps: {
      title: 'Social',
      items: [
        {
          key: 'share',
          text: 'Share'
        },
        {
          key: 'print',
          text: 'Print'
        },
        {
          key: 'music',
          text: 'Music'
        }
      ]
    }
  },
  {
    key: 'section3',
    itemType: ContextualMenuItemType.Section,
    sectionProps: {
      title: 'Navigation',
      items: [
        {
          key: 'Bing',
          text: 'Go to Bing',
          href: 'http://www.bing.com',
          target: '_blank'
        }
      ]
    }
  }
];

const menuProps: IContextualMenuProps = { items: menuItems };






export default class KoreanWorkFlow extends React.Component<IKoreanWorkFlowProps & any, any & {}> {

  
  constructor(props){
    super(props);


   this.state = { 
  logginStatus: true, data:[]
  ,isOpen:false
  ,jwtData:[] as any[]
  ,jwtToken:''
  ,errorStr:''
  };
  



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

  moveTothePage = (e,props,url)=>
  {
    e.preventDefault();
    let {history} = props;
    let returnUrl = `${url}`;

    history.push({
      pathname: returnUrl     
    });

  }

  
  public render(): React.ReactElement<IKoreanWorkFlowProps> {

    const {jwtData,jwtToken,errorStr,logginStatus} = this.state;

    let datafromServer:any[] = jwtData;

    return (
      <div className={ styles.koreanWorkFlow }>

        <Panel
          isOpen={this.state.isOpen}
          onDismiss={this.dismissPanel}
          type={PanelType.smallFixedNear}          
          closeButtonAriaLabel="Close"
          headerText="Sample panel"
        >
<Nav

      selectedKey="key3"
      ariaLabel="Nav basic example"
      styles={{
        root: {
          width: 208,
          height: 350,
          boxSizing: 'border-box',
          border: '1px solid #eee',
          overflowY: 'auto'
        }
      }}
      groups={[
        {
          links: [
            {
              name: 'Home',
              url: 'http://example.com',
              expandAriaLabel: 'Expand Home section',
              collapseAriaLabel: 'Collapse Home section',
              links: [
                {
                  name: 'Activity',
                  url: 'http://msn.com',
                  key: 'key1',
                  target: '_blank'
                },
                {
                  name: 'MSN',
                  url: 'http://msn.com',
                  disabled: true,
                  key: 'key2',
                  target: '_blank'
                }
                ,
                {
                  name: 'Home',
                  url: 'http://example.com',
                  expandAriaLabel: 'Expand Home section',
                  collapseAriaLabel: 'Collapse Home section',
                  links: [
                    {
                      name: 'Activity',
                      url: 'http://msn.com',
                      key: 'key1',
                      target: '_blank'
                    },
                    {
                      name: 'MSN',
                      url: 'http://msn.com',
                      disabled: true,
                      key: 'key2',
                      target: '_blank'
                    }
                    
                  ],
                  isExpanded: true
                }
                
              ],
              isExpanded: true
            },
            {
              name: 'Documents',
              url: 'http://example.com',
              key: 'key3',
              isExpanded: true,
              target: '_blank'
            },
            {
              name: 'Pages',
              url: 'http://msn.com',
              key: 'key4',
              target: '_blank'
            },
            {
              name: 'Notebook',
              url: 'http://msn.com',
              key: 'key5',
              disabled: true
            },
            {
              name: 'Communication and Media',
              url: 'http://msn.com',
              key: 'key6',
              target: '_blank'
            },
            {
              name: 'News',
              url: 'http://cnn.com',
              icon: 'News',
              key: 'key7',
              target: '_blank'
            }
          ]
        }
      ]}
    />


        </Panel>
        <HashRouter basename="/iap">    
        <div className={ styles.container }>
        <div id={"HambergerMenu"} className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2">
          <IconButton onClick={this.openPanel} iconProps={{iconName:"GlobalNavButton"}} title="Emoji" ariaLabel="Emoji"/>
        </div>
        </div>
        <div className="ms-Grid-row">
        
            <div id={"sideMenu"} className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
        <Route component ={(props)=><Nav

      selectedKey="key3"
      ariaLabel="Nav basic example"
      styles={{
        root: {
          width: 208,
          height: 350,
          boxSizing: 'border-box',
          border: '1px solid #eee',
          overflowY: 'auto'
        }
      }}
      groups={[
        {
          links: [
            {
              name: 'Test',
              url: 'http://example.com',
              expandAriaLabel: 'Expand Home section',
              collapseAriaLabel: 'Collapse Home section',
              links: [
                {
                  name: 'Print',
                  url: '/JWT',
                  key: 'key1',
                  onClick:(e)=>this.moveTothePage(e,props,'Print')
                },
                {
                  name: 'JWT',
                  url: '/JWT',
                  key: 'key2',
                  onClick:(e)=>this.moveTothePage(e,props,'JWT')
                }
                ,    
                {        
                  name: 'Grid',
                  url: '/Grid',
                  key: 'key3',
                  onClick:(e)=>this.moveTothePage(e,props,'GRID')
                }
                ,
                {        
                  name: 'Transaction',
                  url: '/Transaction',
                  key: 'key3',
                  onClick:(e)=>this.moveTothePage(e,props,'Transaction')
                }
                ,
                {        
                  name: 'TransactionDemo',
                  url: '/TransactionDemo',
                  key: 'key32',
                  onClick:(e)=>this.moveTothePage(e,props,'TransactionDemo')
                }
                ,
                {
                  name: 'GRID',
                  url: 'http://example.com',
                  expandAriaLabel: 'Expand Home section',
                  collapseAriaLabel: 'Collapse Home section',
                  links: [
                    {
                      name: 'Activity',
                      url: 'https://klatencor.sharepoint.com/teams/uat_InventoryAdjustment#/iap/InventoryReport',
                      key: 'key1',
                      target: '_blank'
                    },
                    {
                      name: 'MSN',
                      url: 'http://msn.com',
                      disabled: true,
                      key: 'key2',
                      target: '_blank'
                    }
                    
                  ],
                  isExpanded: true
                }
              ],
              isExpanded: true
            },
            {
              name: 'Documents',
              url: 'http://example.com',
              key: 'key3',
              isExpanded: true,
              target: '_blank'
            },
            {
              name: 'Pages',
              url: 'http://msn.com',
              key: 'key4',
              target: '_blank'
            },
            {
              name: 'Notebook',
              url: 'http://msn.com',
              key: 'key5',
              disabled: true
            },
            {
              name: 'Communidcation and Media',
              url: 'http://msn.com',
              key: 'key6',
              target: '_blank'
            },
            {
              name: 'Newds',
              url: 'http://cnn.com',
              icon: 'News',
              key: 'key7',
              target: '_blank'
            }
          ]
        }
      ]}
    />} />

            </div>
            <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">

            <div>  
                      
                <Switch>                        
                  <Route exact path="/"  component={(props)=>  
                    <div className="main-content">
                      <div className="content">
                        <JwtTest {...props} {...this.props }  />                             
                      </div>
                    </div>} 
                  />   
                  <Route exact path="/Grid"  component={(props)=>  
                    <div className="main-content">
                      <div className="content">
                        <TestGrid {...props} {...this.props }  />                             
                      </div>
                    </div>}
                  />  
                   <Route exact path="/Transaction"  component={(props)=>  
                    <div className="main-content">
                      <div className="content">
                        <TransactionTest {...props} {...this.props }  />                             
                      </div>
                    </div>}
                  /> 
                  <Route exact path="/TransactionDemo"  component={(props)=>  
                    <div className="main-content">
                      <div className="content">
                        <TransactionTestPage {...props} {...this.props }  />                             
                      </div>
                    </div>}
                  />                                       
                </Switch>     
              </div>
            </div>
          </div>
        </div>
        </HashRouter>
      </div>
    );
  }
}
