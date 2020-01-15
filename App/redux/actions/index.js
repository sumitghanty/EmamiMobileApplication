import {getReqName} from './GetReqName'
import {getReqClaimName} from './GetReqClaimName'
import {getAttachment} from './GetAttachment'
import {getStatus} from './GetStatus'
import {getTrips} from './TripList'
import {tripCreate} from './TripCreate'
import {tripUpdate} from './TripUpdate'
import {getPlans} from './TripPlan'
import {initiatePlan} from './PlanInitiate'
import {getReqType} from './ReqType'
import {getApprovedTripPending} from './ApprovedTripPendingList'
import {getAdvPmntPend} from './AprvPmntPendList'
import {aprvTripNonReq} from './TripApproveNonReq'
import {postAprvTripWithReq} from './TripApproveWithReq'
import {advPmnt} from './AdvPmnt'
import {reqCreate} from './ReqCreate'
import {reqUpdate} from './ReqUpdate'
import {reqDelete} from './ReqDelete'
import {getAdvPmnts} from './AdvPmntList'
import {postAprAdvPmnt} from './AprvAdvPmnt'
import {getExpPendApr} from './AprExpPend'
import {postExpAprv} from './ExpAprv'
import {getCostCentre} from './CostCentre'
import {getPjp} from './PJPList'
import {getPjpClaim} from './PjpClaimList'
import {getPjpAprvList} from './PJPAprvList'
import {postPjpAprv} from './PjpAprv'
import {postPjpClaimAprv} from './PjpClaimAprv'
import {getReqSale} from './ReqListSales'
import {getReqClaimSale} from './ReqClaimListSales'

export default {
	getReqName:getReqName,
	getReqClaimName:getReqClaimName,
	getAttachment:getAttachment,
	getStatus:getStatus,
  getTrips:getTrips,
	tripCreate:tripCreate,
	tripUpdate:tripUpdate,
  getPlans:getPlans,
  initiatePlan:initiatePlan,
  getReqType:getReqType,
  getApprovedTripPending:getApprovedTripPending,
	getAdvPmntPend:getAdvPmntPend,
  aprvTripNonReq:aprvTripNonReq,
	postAprvTripWithReq:postAprvTripWithReq,
	advPmnt:advPmnt,
	reqCreate:reqCreate,
	reqUpdate:reqUpdate,
	reqDelete:reqDelete,
	getAdvPmnts:getAdvPmnts,
	postAprAdvPmnt:postAprAdvPmnt,
	getExpPendApr:getExpPendApr,
	postExpAprv:postExpAprv,
	getCostCentre:getCostCentre,
	getPjp:getPjp,
	getPjpClaim:getPjpClaim,
	getPjpAprvList:getPjpAprvList,
	postPjpAprv:postPjpAprv,
	postPjpClaimAprv:postPjpClaimAprv,
	getReqSale:getReqSale,
	getReqClaimSale:getReqClaimSale
}
