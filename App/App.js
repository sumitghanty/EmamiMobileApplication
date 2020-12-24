import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './Containers/LoginScreen'
import HomeScreen from './Containers/HomeScreen'
import TripListScreen from './Containers/TripListScreen'
import TripCreateScreen from './Containers/TripCreateScreen'
import TripUpdateScreen from './Containers/TripUpdateScreen'
import TripPlanScreen from './Containers/TripPlanScreen'
import SplashScreen from './Containers/SplashScreen'
import ForgotScreen from './Containers/ForgotScreen'
import TaxiRequisitionScreen from './Containers/TaxiRequisitionScreen'
import NonActaxiReqScreen from './Containers/NonActaxiReqScreen'
import SalesTaxiRequisitionScreen from './Containers/SalesTaxiRequisitionScreen'
import AirRequisitionScreen from './Containers/AirRequisitionScreen'
import TrainReqScreen from './Containers/TrainReqScreen'
import HotelReqScreen from './Containers/HotelReqScreen'
import OtherRequisitionScreen from './Containers/OtherRequisitionScreen'
import RailCommisionScreen from './Containers/RailCommisionScreen'
import TripInfoScreen from './Containers/TripInfoScreen'
import ReqInfoScreen from './Containers/ReqInfoScreen'
import AdvanceScreen from './Containers/AdvanceScreen'
import AdvPmntReqScreen from './Containers/AdvPmntReqScreen'
import AdvPmntReqInfoScreen from './Containers/AdvPmntReqInfoScreen'
import PjpListScreen from './Containers/PjpListScreen'
import PjpInfoScreen from './Containers/PjpInfoScreen'
import PjpCreateScreen from './Containers/PjpCreateScreen'
import ExpensesListScreen from './Containers/ExpensesListScreen'
import ExpInfoScreen from './Containers/ExpInfoScreen'
import ApproveNoneSaleScreen from './Containers/ApproveNoneSaleScreen'
import ApproveNoneSaleTripScreen from './Containers/ApproveNoneSaleTripScreen'
import ApproveNoneSaleTripDetailsScreen from './Containers/ApproveNoneSaleTripDetailsScreen'
import ApproveNoneSaleAdvanceScreen from './Containers/ApproveNoneSaleAdvanceScreen'
import ApproveNoneSaleExpensesScreen from './Containers/ApproveNoneSaleExpensesScreen'
import AprvExpnsClaimPendInfoScreen from './Containers/AprvExpnsClaimPendInfoScreen'
import ApproveSaleScreen from './Containers/ApproveSaleScreen'
import PjpTripListScreen from './Containers/PjpTripListScreen'
import PjpTripAprvScreen from './Containers/PjpTripAprvScreen'
import PjpAprvListScreen from './Containers/PjpAprvListScreen'
import PjpReqDtlScreen from './Containers/PjpReqDtlScreen'
import PjpClaimAprvScreen from './Containers/PjpClaimAprvScreen'
import SalesReqScreen from './Containers/SalesReqScreen'
import Drawer from './Components/Drawer'
import PjpClaimListScreen from './Containers/PjpClaimListScreen'
import PjpClaimInfoScreen from './Containers/PjpClaimInfoScreen'
import SalesClaimReqScreen from './Containers/SalesClaimReqScreen'
import AirReqSalesScreen from './Containers/AirReqSalesScreen'
import AirReqSalesClaimScreen from './Containers/AirReqSalesClaimScreen'

class MenuBtn extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} style={{paddingHorizontal:12, paddingVertical:8}}>
          <Icon name="ios-menu" size={32} style={{color:'rgba(0,0,0,.5)'}} />
        </TouchableOpacity>
    );
  }
}
class HomeBtn extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.navigationProps.navigate('Home')} style={{paddingHorizontal:12, paddingVertical:8}}>
        <Icon name="ios-home" size={27} style={{color:'rgba(0,0,0,.5)'}} />
      </TouchableOpacity>
    );
  }
}

const StackNavigator = createStackNavigator({
  Splash: {
    screen: SplashScreen,
    navigationOptions: {
      header: null,
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    }
  },
  Forgot: {
    screen: ForgotScreen,
    navigationOptions: {
      headerTitle: 'Forgot Password',
    }
  },
  Home: {
    screen: HomeScreen,
    drawerLabel: "Home",
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerLeft: <MenuBtn navigationProps={navigation} />,
    })
  },
  TripList: {
    screen: TripListScreen,
    drawerLabel: "Trip List",
    navigationOptions: ({ navigation }) => ({
      title: 'Trip List',
      headerLeft: <MenuBtn navigationProps={navigation} />,
      headerRight: <HomeBtn navigationProps={navigation}/>,
    })
  },
  TripCreate: {
    screen: TripCreateScreen,
    drawerLabel: "New Trip",
    navigationOptions: ({ navigation }) => ({
      title: 'New Trip',
    })
  },
  TripInfo: {
    screen: TripInfoScreen,
    navigationOptions: {
      headerTitle: 'Trip Details',
    }
  },
  TripUpdate: {
    screen: TripUpdateScreen,
    navigationOptions: {
      headerTitle: 'Modify Trip',
    }
  },
  TripPlan: {
    screen: TripPlanScreen,
    drawerLabel: "Plan Your Trip",
    navigationOptions: {
      headerTitle: 'Plan Trip',
    },
  },  
  ReqInfo: {
    screen: ReqInfoScreen,
    navigationOptions: {
      headerTitle: 'Requisition Details',
    },
  },
  TaxiRequisition: {
    screen: TaxiRequisitionScreen,
    navigationOptions: {
      headerTitle: 'AC Taxi',
    },
  },  
  SalesTaxiRequisition: {
    screen: SalesTaxiRequisitionScreen,
    navigationOptions: {
      headerTitle: 'Sales AC Taxi',
    },
  },  
  AirRequisition: {
    screen: AirRequisitionScreen,
    navigationOptions: {
     // headerTitle: 'Create Requisition',
    },
  },
  TrainReq: {
    screen: TrainReqScreen,
    navigationOptions: {
     // headerTitle: 'Create Requisition',
    },
  },
  NonActaxiReq: {
    screen: NonActaxiReqScreen,
    navigationOptions: {
     // headerTitle: 'Create Requisition',
    },
  },

  HotelReq: {
    screen: HotelReqScreen,
    navigationOptions: {
     // headerTitle: 'Create Requisition',
    },
  },
  OtherRequisition: {
    screen: OtherRequisitionScreen,
    navigationOptions: {
     // headerTitle: 'Create Requisition',
    },
  },
	RailCommision: {
    screen: RailCommisionScreen,
    navigationOptions: {
      headerTitle: 'Rail comission',
      //headerTitle: 'Create Requisition',
    },
  },
  Advance: {
    screen: AdvanceScreen,
    drawerLabel: "Advance Payment",
    navigationOptions: ({ navigation }) => ({
      title: 'Advance Payment List',
      headerLeft: <MenuBtn navigationProps={navigation} />,
      headerRight: <HomeBtn navigationProps={navigation}/>,
    })
  },
  AdvPmntReq: {
    screen: AdvPmntReqScreen,
    drawerLabel: "Advance Payment Requisition",
    navigationOptions: ({ navigation }) => ({
      title: 'Advance Payment Information'
    })
  },
  AdvPmntReqInfo: {
    screen: AdvPmntReqInfoScreen,
    drawerLabel: "Advance Payment Details",
    navigationOptions: ({ navigation }) => ({
      title: 'Advance Payment Details'
    })
  },
  PjpList: {
    screen: PjpListScreen,
    drawerLabel: "PJP",
    navigationOptions: ({ navigation }) => ({
      title: 'Create / View PJP',
      headerLeft: <MenuBtn navigationProps={navigation} />,
      headerRight: <HomeBtn navigationProps={navigation}/>,
    })
  },
  PjpInfo: {
    screen: PjpInfoScreen,
    drawerLabel: "PJP Details",
    navigationOptions: ({ navigation }) => ({
      title: 'PJP Details',
    })
  },
  PjpCreate: {
    screen: PjpCreateScreen,
    drawerLabel: "Create New PJP",
    navigationOptions: ({ navigation }) => ({
      title: 'Create New PJP',
    })
  },
  ExpensesList: {
    screen: ExpensesListScreen,
    drawerLabel: "Create/View Expenses",
    navigationOptions: ({ navigation }) => ({
      title: 'Create/View Expenses',
      headerLeft: <MenuBtn navigationProps={navigation} />,
      headerRight: <HomeBtn navigationProps={navigation}/>,
    })
  },
  ExpInfo: {
    screen: ExpInfoScreen,
    drawerLabel: "Expenses Details",
    navigationOptions: ({ navigation }) => ({
      title: 'Expenses Details',
    })
  },
  ApproveNoneSale: {
    screen: ApproveNoneSaleScreen,
    drawerLabel: "Approve Expense/Trip Non Sales",
    navigationOptions: ({ navigation }) => ({
      title: 'Approve Expense/Trip Non Sales',
      headerLeft: <MenuBtn navigationProps={navigation} />,
      headerRight: <HomeBtn navigationProps={navigation}/>,
    })
  },
  ApproveNoneSaleTrip: {
    screen: ApproveNoneSaleTripScreen,
    drawerLabel: "Trip Pending for Approval",
    navigationOptions: ({ navigation }) => ({
      title: 'Trip Pending for Approval',
    })
  },
  ApproveNoneSaleTripDetails: {
    screen: ApproveNoneSaleTripDetailsScreen,
    drawerLabel: "Trip Details",
    navigationOptions: ({ navigation }) => ({
      title: 'Trip Details',
    })
  },
  ApproveNoneSaleAdvance: {
    screen: ApproveNoneSaleAdvanceScreen,
    drawerLabel: "Advance payment pending for Approval",
    navigationOptions: ({ navigation }) => ({
      title: 'Advance payment pending for Approval',
    })
  },
  ApproveNoneSaleExpenses: {
    screen: ApproveNoneSaleExpensesScreen,
    drawerLabel: "Expense Claim pending for Approval",
    navigationOptions: ({ navigation }) => ({
      title: 'Expense Claim pending for Approval'
    })
  },
  AprvExpnsClaimPendInfo: {
    screen: AprvExpnsClaimPendInfoScreen,
    drawerLabel: "Expense Claim Details",
    navigationOptions: ({ navigation }) => ({
      title: 'Expense Claim Details'
    })
  },
  ApproveSale: {
    screen: ApproveSaleScreen,
    drawerLabel: "Approve PJP/Expense",
    navigationOptions: ({ navigation }) => ({
      title: 'Approve PJP/Expense',
      headerLeft: <MenuBtn navigationProps={navigation} />,
      headerRight: <HomeBtn navigationProps={navigation}/>,
    })
  },
  PjpTripList: {
    screen:  PjpTripListScreen,
    drawerLabel: "List of Expense/PJP",
    navigationOptions: ({ navigation }) => ({
      title: 'List of Expense/PJP'
    })
  },  
  PjpAprvList: {
    screen:  PjpAprvListScreen,
    drawerLabel: "PJP/Claim pending for approval",
    navigationOptions: ({ navigation }) => ({
      title: 'PJP/Claim pending for approval'
    })
  },
  PjpTripAprv: {
    screen:  PjpTripAprvScreen,
    drawerLabel: "Approve Tour/PJP",
    navigationOptions: ({ navigation }) => ({
      title: 'Approve Tour/PJP'
    })
  },  
  PjpReqDtl: {
    screen:  PjpReqDtlScreen,
    drawerLabel: "Requisition Details",
    navigationOptions: ({ navigation }) => ({
      title: 'Requisition Details'
    })
  },
  PjpClaimList: {
    screen:  PjpClaimListScreen,
    drawerLabel: "Expenses List",
    navigationOptions: ({ navigation }) => ({
      title: 'Expenses List'
    })
  },
  PjpClaimAprv: {
    screen:  PjpClaimAprvScreen,
    drawerLabel: "Approve PJP-Claim",
    navigationOptions: ({ navigation }) => ({
      title: 'Approve PJP-Claim'
    })
  },  
  SalesReq: {
    screen:  SalesReqScreen,
    drawerLabel: "Create/Update Requisitions",
    navigationOptions: ({ navigation }) => ({
      title: 'Create/Update Requisitions'
    })
  },   
  PjpClaimInfo: {
    screen:  PjpClaimInfoScreen,
    drawerLabel: "Claim Details",
    navigationOptions: ({ navigation }) => ({
      title: 'Expense Details'
    })
  },
  SalesClaimReq: {
    screen:  SalesClaimReqScreen,
    drawerLabel: "Create/Update Line Item",
    navigationOptions: ({ navigation }) => ({
      title: 'Create/Update Line Item'
    })
  },
  
  AirReqSales: {
    screen:  AirReqSalesScreen,
    drawerLabel: "Air Requisition",
    navigationOptions: ({ navigation }) => ({
      title: 'Air Requisition'
    })
  },
  AirReqSalesClaim: {
    screen:  AirReqSalesClaimScreen,
    drawerLabel: "Air Travel",
    navigationOptions: ({ navigation }) => ({
      title: 'Air Travel'
    })
  },
});

StackNavigator.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  let drawerLessScreen = navigation.state.routes[navigation.state.routes.length-1].routeName;
  if (drawerLessScreen == 'Login' || drawerLessScreen == 'Splash' || drawerLessScreen == 'Forgot') {
    drawerLockMode = 'locked-closed';
  }
  return {
    drawerLockMode,
  };
};

const MyDrawerNavigator = createDrawerNavigator({
  HomeStack: {
    screen: StackNavigator,
  },
},{
	contentComponent: Drawer
});

const App = createAppContainer(MyDrawerNavigator);

export default App