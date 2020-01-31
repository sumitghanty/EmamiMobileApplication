import LocationsReducer from './GetLocations'
import StateListReducer from './GetState'
import ReqNameReducer from './GetReqName'
import TripForReducer from './GetTripFor'
import PurposeReducer from './GetPurpose'
import RetainerReducer from './GetRetainer'
import ReqClaimNameReducer from './GetReqClaimName'
import AttachmentReducer from './GetAttachment'
import StatusReducer from './GetStatus'
import TravelThroughReducer from './GetTravelThrough'
import TravelTypeReducer from './GetTravelType'
import TripListReducer from './TripList'
import TripCreateReducer from './TripCreate'
import TripUpdateReducer from './TripUpdate'
import TripPlanReducer from './TripPlan'
import PlanUpdateReducer from './PlanInitiate'
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
	locations:LocationsReducer,
	stateList:StateListReducer,
	reqClaimName:ReqClaimNameReducer,
	tripFor:TripForReducer,
	purpose:PurposeReducer,
	retainer:RetainerReducer,
	reqName:ReqNameReducer,
	attachment:AttachmentReducer,
	statusResult:StatusReducer,
	travelThroughState:TravelThroughReducer,
	travelTypeState:TravelTypeReducer,
	trips:TripListReducer,
	tripCreate:TripCreateReducer,
	tripUpdate:TripUpdateReducer,
	plans:TripPlanReducer,
	planUpdateState:PlanUpdateReducer,
	reqType:ReqTypeReducer,
	aprvTripPend:ApprovedTripPendingReducer,
	aprvPmntPend:AdvPmntPendListReducer,
	aprvTripNonReq:TripAprvNonReqReducer,
	aprvTripWithReq:TripAprvWithReqReducer,
	advPmnt:AdvPmntReducer,
	reqCreateState:ReqCreateReducer,
	reqUpdateState:ReqUpdateReducer,
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
