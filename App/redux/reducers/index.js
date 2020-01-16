import ReqNameReducer from './GetReqName'
import ReqClaimNameReducer from './GetReqClaimName'
import AttachmentReducer from './GetAttachment'
import StatusReducer from './GetStatus'
import TripListReducer from './TripList'
import TripCreateReducer from './TripCreate'
import TripUpdateReducer from './TripUpdate'
import TripPlanReducer from './TripPlan'
import PlanInititeReducer from './PlanInitiate'
import ReqTypeReducer from './ReqType'
import ApprovedTripPendingReducer from './ApprovedTripPendingList'
import AdvPmntPendListReducer from './AprvPmntPendList'
import TripAprvNonReqReducer from './TripApproveNonReq'
import TripAprvWithReqReducer from './TripApproveWithReq'
import AdvPmntReducer from './AdvPmnt'
import ReqCreateReducer from './ReqCreate'
import ReqUpdateReducer from './ReqUpdate'
import ReqDeleteReducer from './ReqDelete'
import AdvPmntListReducer from './AdvPmntList'
import AprvAdvPmntReducer from './AprvAdvPmnt'
import AprExpPendReducer from './AprExpPend'
import ExpAprvReducer from './ExpAprv'
import CostCentreReducer from './CostCentre'
import PjpListReducer from './PJPList'
import PjpClaimListReducer from './PjpClaimList'
import PjpAprvListReducer from './PJPAprvList'
import PjpAprvReducer from './PjpAprv'
import PjpClaimAprvReducer from './PjpClaimAprv'
import ReqListSalesReducer from './ReqListSales'
import ReqClaimListSalesReducer from './ReqClaimListSales'
import PjpClaimTotReducer from './PjpClaimTot'
import PjpClaimRejReducer from './PjpClaimRej'

export default {
	reqClaimName:ReqClaimNameReducer,
	reqName:ReqNameReducer,
	attachment:AttachmentReducer,
	statusResult:StatusReducer,
  trips:TripListReducer,
	tripCreate:TripCreateReducer,
	tripUpdate:TripUpdateReducer,
  plans:TripPlanReducer,
  PlanInitiate:PlanInititeReducer,
  reqType:ReqTypeReducer,
  aprvTripPend:ApprovedTripPendingReducer,
	aprvPmntPend:AdvPmntPendListReducer,
  aprvTripNonReq:TripAprvNonReqReducer,
	aprvTripWithReq:TripAprvWithReqReducer,
	advPmnt:AdvPmntReducer,
	reqCreate:ReqCreateReducer,
	reqUpdate:ReqUpdateReducer,
	reqDelete:ReqDeleteReducer,
	advPmnts:AdvPmntListReducer,
	aprAdvPmnt:AprvAdvPmntReducer,
	aprExpPend:AprExpPendReducer,
	expAprv:ExpAprvReducer,
	costCentre:CostCentreReducer,
	pjp:PjpListReducer,
	pjpClaims:PjpClaimListReducer,
	pjpAprvList:PjpAprvListReducer,
	pjpAprv:PjpAprvReducer,
	pjpClaimAprv:PjpClaimAprvReducer,
	reqListSales:ReqListSalesReducer,
	reqClaimListSales:ReqClaimListSalesReducer,
	pjpClaimTot:PjpClaimTotReducer,
	pjpClaimRej:PjpClaimRejReducer
};
