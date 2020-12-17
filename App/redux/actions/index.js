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
import {generateId} from './GenerateId'
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
import {postPjpAprvMaster} from './PjpAprvMaster'
import {postPjpClaimAprv} from './PjpClaimAprv'
import {getReqSale} from './ReqListSales'
import {getReqClaimSale} from './ReqClaimListSales'
import {postPjpClaimTot} from './PjpClaimTot'
import {postPjpClaimRej} from './PjpClaimRej'
import {getVendor} from './GetVendor'
import {getTickets} from './GetTickets'
import {getTicketsSales} from './GetTicketsSales'
import {tripEndDateUpdate} from './TripEndDateUpdate'
import {plansSubmit} from './PlansSubmit'
import {updateVndAirRes} from './UpdateVndAirRes'
import {updateVndAirResSales} from './UpdateVndAirResSales'
import {getExpenses} from './ExpList'
import {updtReqNSBD} from  './updtReqNSBD'
import {trpNSClmDtlUpdt} from  './TrpNSClmDtlUpdt'
import {getHotels} from './GetHotel'
import {tripClaimUpdate} from './TripClaimUpdate'
import {getReqTypeSale} from './SaleReqType'
import {createReqSale} from './CreateReqSale'
import {updtReqSale} from './UpdtReqSale'
import {deleteReqSale} from './DeleteReqSale'
import {getCityName} from './GetCityName'
import {generateExp} from './GenerateExp'
import {pjpCreate} from './PJPCreate'
import {pjpUpdate} from './PJPUpdate'
import {pjpTotal} from './PJPTotal'
import {pjpDelete} from './PJPDelete'
import {getMaxAmnt} from './GetMaxAmnt'
import {getYear} from './GetYear'
import {getPjpByMonth} from './GetPjpByMonth'
import {attachment} from './Attachment'
import {getAttachments} from './GetAttachments'
import {getAttachmentsSales} from './GetAttachmentsSales'
import {attachmentSales} from './AttachmentSales'
import {attachmentDelete} from './DeleteAttachment'
import {attachmentDeleteSales} from './DeleteAttachmentSales'
import {sendEmail} from './SendEmail'
import {sendEmailSales} from './SendEmailSales'
import {ceateClaimReq} from './ClaimReqCreate'
import {updatePjpTot} from './UpdatePjpTot'
import {updtClaimReq} from './UpdtClaimReq'
import {getRefernce} from './GetRefernce'

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
	generateId:generateId,
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
	postPjpAprvMaster:postPjpAprvMaster,
	postPjpClaimAprv:postPjpClaimAprv,
	getReqSale:getReqSale,
	getReqClaimSale:getReqClaimSale,
	postPjpClaimTot:postPjpClaimTot,
	postPjpClaimRej:postPjpClaimRej,
	getVendor:getVendor,
	getTickets:getTickets,
	getTicketsSales:getTicketsSales,
	tripEndDateUpdate:tripEndDateUpdate,
	plansSubmit:plansSubmit,
	updateVndAirRes:updateVndAirRes,
	updateVndAirResSales:updateVndAirResSales,
	getExpenses:getExpenses,
	getReqClaimType:getReqClaimType,
	updtReqNSBD:updtReqNSBD,
	trpNSClmDtlUpdt:trpNSClmDtlUpdt,
	getHotels:getHotels,
	tripClaimUpdate:tripClaimUpdate,
	getReqTypeSale:getReqTypeSale,
	createReqSale:createReqSale,
	updtReqSale:updtReqSale,
	deleteReqSale:deleteReqSale,
	getCityName:getCityName,
	generateExp:generateExp,
	pjpTotal:pjpTotal,
	pjpCreate: pjpCreate,
	pjpDelete:pjpDelete,
	pjpUpdate:pjpUpdate,
	getMaxAmnt:getMaxAmnt,
	getYear:getYear,
	getPjpByMonth:getPjpByMonth,
	attachment:attachment,
	getAttachments:getAttachments,
	getAttachmentsSales:getAttachmentsSales,
	attachmentSales:attachmentSales,
	attachmentDelete:attachmentDelete,
	attachmentDeleteSales:attachmentDeleteSales,
	sendEmail:sendEmail,
	sendEmailSales:sendEmailSales,
	ceateClaimReq:ceateClaimReq,
	updatePjpTot:updatePjpTot,
	updtClaimReq:updtClaimReq,
	getRefernce:getRefernce
}
