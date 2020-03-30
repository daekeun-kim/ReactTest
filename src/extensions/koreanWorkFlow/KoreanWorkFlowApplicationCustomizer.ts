import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'KoreanWorkFlowApplicationCustomizerStrings';

const LOG_SOURCE: string = 'KoreanWorkFlowApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IKoreanWorkFlowApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class KoreanWorkFlowApplicationCustomizer
  extends BaseApplicationCustomizer<IKoreanWorkFlowApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    if ( !this._topPlaceholder){
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

      if (!this._topPlaceholder){
        console.error('we have an error');
        return;
      }

      if (this._topPlaceholder.domElement){

        this._topPlaceholder.domElement.innerHTML=`
        <div>
          <div>
            here's the message : ${escape(this.properties.testMessage)} :
           </div>
        <div>
        `;

      }

    return Promise.resolve();
  }
  }
}
