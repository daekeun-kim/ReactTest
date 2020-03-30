import pnp  from "sp-pnp-js";

import { AbsISPTRansactionTracker } from "../../../Common/SharePointTool/AbsISPTransactionTracker";

export class MirinaeTest extends AbsISPTRansactionTracker {


    getTrackerSharePointSite(): string {
        return "https://klatencor.sharepoint.com/teams/dev_mirinae"
    }
    getApplicationName(): string {
        return "MirinaeTest"
    }
    getTransactionName(): string {
        return    "test"
    }
    getSendToUserEmailWhenFail(): string {
        return "daekeun.kim@kla-tencor.com";
    }
    getSendToAdminEmailWhenFail(): string {
        return "daekeun.kim@kla-tencor.com";
    }


}