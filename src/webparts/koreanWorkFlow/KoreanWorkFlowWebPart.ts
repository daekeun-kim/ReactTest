import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'KoreanWorkFlowWebPartStrings';
import KoreanWorkFlow from './components/KoreanWorkFlow';
import { IKoreanWorkFlowProps } from './components/IKoreanWorkFlowProps';
import { Person } from '../Common/test';

export interface IKoreanWorkFlowWebPartProps {
  description: string;
}

export default class KoreanWorkFlowWebPart extends BaseClientSideWebPart<IKoreanWorkFlowWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IKoreanWorkFlowProps > = React.createElement(
      KoreanWorkFlow,
      {
        description: this.properties.description
      }
    );

    let test = new Person();

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
