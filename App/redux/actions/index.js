import {getReqLocations} from './GetLocations'
import {getStates} from './GetState'
import {getReqName} from './GetReqName'
import {getTripFor} from './GetTripFor'
import {getPurpose} from './GetPurpose'
import {getRetainer} from './GetRetainer'
import {getReqClaimName} from './GetReqClaimName'
import {getStatus} from './GetStatus'
import {getTravelThrough} from './GetTravelThrough'
import {getTravelType} from './GetTravelType'
import {getTrips} from './TripList'
import {tripCreate} from './TripCreate'
import {tripUpdate} from './TripUpdate'
import {getPlans} from './TripPlan'
import {planUpdate} from './PlanInitiate'
import {getReqType} from './ReqType'
import {getReqClaimType} from './ReqClaimType'
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
import {postPjpClaimTot} from './PjpClaimTot'
import {postPjpClaimRej} from './PjpClaimRej'
import {getVendor} from './GetVendor'
import {getTickets} from './GetTickets'
import {tripEndDateUpdate} from './TripEndDateUpdate'
import {plansSubmit} from './PlansSubmit'
import {updateVndAirRes} from './UpdateVndAirRes'
import {getExpenses} from './ExpList'
import {updtReqNSBD} from  './updtReqNSBD'
import {trpNSClmDtlUpdt} from  './TrpNSClmDtlUpdt'
import {getHotels} from './GetHotel'
import {tripClaimUpdate} from './TripClaimUpdate'
import {attachment} from './Attachment'
import {getAttachments} from './GetAttachments'
import {sendEmail} from './SendEmail'

export default {
	getReqLocations:getReqLocations,
	getStates:getStates,
	getReqName:getReqName,
	getTripFor:getTripFor,
	getPurpose:getPurpose,
	getRetainer:getRetainer,
	getReqClaimName:getReqClaimName,
	getStatus:getStatus,
	getTravelThrough:getTravelThrough,
	getTravelType:getTravelType,
	getTrips:getTrips,
	tripCreate:tripCreate,
	tripUpdate:tripUpdate,
	getPlans:getPlans,
	planUpdate:planUpdate,
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
	getReqClaimSale:getReqClaimSale,
	postPjpClaimTot:postPjpClaimTot,
	postPjpClaimRej:postPjpClaimRej,
	getVendor:getVendor,
	getTickets:getTickets,
	tripEndDateUpdate:tripEndDateUpdate,
	plansSubmit:plansSubmit,
	updateVndAirRes:updateVndAirRes,
	getExpenses:getExpenses,
	getReqClaimType:getReqClaimType,
	updtReqNSBD:updtReqNSBD,
	trpNSClmDtlUpdt:trpNSClmDtlUpdt,
	getHotels:getHotels,
	tripClaimUpdate:tripClaimUpdate,
	attachment:attachment,
	getAttachments:getAttachments,
	sendEmail:sendEmail
}
