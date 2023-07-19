import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ContentRoute, LayoutSplashScreen } from '../_metronic/layout';
import { AddAdminPage } from './pages/AddAdminPage';
import { AddCommissionPage } from './pages/AddCommissionPage';
import { AddMainOrganizationPage } from './pages/AddMainOrganizationPage';
import { AddMemberPage } from './pages/AddMemberPage';
import { AddOrganizationStatus } from './pages/AddOrganizationStatus';
import { AdminPage } from './pages/AdminPage';
import { BuilderPage } from './pages/BuilderPage';
import { CommissionPage } from './pages/CommissionPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditCommission } from './pages/EditCommission';
import { EditMainOrganization } from './pages/EditMainOrganization';
import { EditOrganizationStatus } from './pages/EditOrganizationStatus';
import { HealthPage } from './pages/HealthPage';
import { MainOrganizationPage } from './pages/MainOrganizationPage';
import { MemberNumberingPage } from './pages/MemberNumberingPage';
import { MemberPage } from './pages/MemberPage';
import { MyPage } from './pages/MyPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { StatusOrganizationPage } from './pages/StatusOrganizationPage';

import { PaymentCheckoutPage } from './pages/Payment/Checkout';

import { JabatanAddPage } from './pages/Jabatan/Add';
import { JabatanEditPage } from './pages/Jabatan/Edit';
import { JabatanListPage } from './pages/Jabatan/List';
import { AdministratorAddPage } from './pages/Administrator/Add';
import { AdministratorEditPage } from './pages/Administrator/Edit';
import { AdministratorListPage } from './pages/Administrator/List';
import { RegionAdministratorAddPage } from './pages/RegionAdministrator/Add';
import { RegionAdministratorEditPage } from './pages/RegionAdministrator/Edit';
import { RegionAdministratorListPage } from './pages/RegionAdministrator/List';
import { MemberListPage } from './pages/Member/List';
import { MemberDetailPage } from './pages/Member/Detail';
import { MemberEditPage } from './pages/Member/Edit';
import { MemberBulkCreatePage } from './pages/Member/BulkCreate';
import { UploadMember } from './pages/Member/UploadMember';
import { EventAddPage } from './pages/Event/Add';
import { EventEditPage } from './pages/Event/Edit';
import { EventListPage } from './pages/Event/List';
import { CommentEventList } from './pages/Event/Comments';
import { EventMemberListPage } from './pages/Event/MemberList';
import { NewsAddPage } from './pages/News/Add';
import { NewsEditPage } from './pages/News/Edit';
import { NewsListPage } from './pages/News/List';
import { CommentNewsList } from './pages/News/Comments';
import { WebAppSettings } from './pages/WebAppSettings/WebAppSettings';
import { CommissionAddPage } from './pages/Commission/Add';
import { CommissionEditPage } from './pages/Commission/Edit';
import { CommissionListPage } from './pages/Commission/List';
import { CommissionMainOrganizationListPage } from './pages/Commission/MainOrganizationList';
import { MainOrganizationAddPage } from './pages/MainOrganization/Add';
import { MainOrganizationEditPage } from './pages/MainOrganization/Edit';
import { MainOrganizationListPage } from './pages/MainOrganization/List';
import { StatusOrganizationAddPage } from './pages/StatusOrganization/Add';
import { StatusOrganizationEditPage } from './pages/StatusOrganization/Edit';
import { StatusOrganizationListPage } from './pages/StatusOrganization/List';
import { CmsAdministratorAddPage } from './pages/CmsAdministrator/Add';
import { CmsAdministratorEditPage } from './pages/CmsAdministrator/Edit';
import { CmsAdministratorListPage } from './pages/CmsAdministrator/List';
import { CmsAdministratorDetailPage } from './pages/CmsAdministrator/Detail';
import { TransactionListPage } from './pages/Transaction/List';
import { TransactionInvoicePage } from './pages/Transaction/Invoice';
import { MemberCreate } from './pages/Member/MemberCreate';

import { PengurusList } from './pages/Pengurus/List';
import { PengurusAddPage } from './pages/Pengurus/Add';
import { PengurusEditPage } from './pages/Pengurus/Edit';

const GoogleMaterialPage = lazy(() => import('./modules/GoogleMaterialExamples/GoogleMaterialPage'));
const ReactBootstrapPage = lazy(() => import('./modules/ReactBootstrapExamples/ReactBootstrapPage'));
const ECommercePage = lazy(() => import('./modules/ECommerce/pages/eCommercePage'));
const UserProfilepage = lazy(() => import('./modules/UserProfile/UserProfilePage'));

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  /*
    adminRole = [
        ['value' => 0, 'label' => 'Super Admin'],
        ['value' => 1, 'label' => 'Admin Nasional'],
        ['value' => 2, 'label' => 'Admin Provinsi'],
        ['value' => 3, 'label' => 'Admin Kota'],
        ['value' => 6, 'label' => 'Admin Mandiri'],
        ['value' => 7, 'label' => 'Admin Kormi'],
    ]
  */

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from='/' to='/dashboard' />
        }
        <ContentRoute path='/dashboard' component={DashboardPage} />
        <ContentRoute path='/builder' component={BuilderPage} />
        <ContentRoute path='/my-page' component={MyPage} />
        {/* <ContentRoute path="/main-organization" component={MainOrganizationPage} /> */}
        <ContentRoute path='/admin' component={AdminPage} />
        {/* <ContentRoute path="/commission" component={CommissionPage} /> */}
        <ContentRoute path='/healt' component={HealthPage} />

        <ContentRoute role='0,1' exact path='/news' component={NewsListPage} />
        <ContentRoute role='0,1' exact path='/news/create' component={NewsAddPage} />
        <ContentRoute role='0,1' exact path='/news/:id/update' component={NewsEditPage} />
        <ContentRoute role='0,1' exact path='/news/comments/:id' component={CommentNewsList} />

        <ContentRoute role='0,1' exact path='/event' component={EventListPage} />
        <ContentRoute role='0,1' exact path='/event/create' component={EventAddPage} />
        <ContentRoute role='0,1' exact path='/event/:id/update' component={EventEditPage} />
        <ContentRoute role='0,1' exact path='/event/:id/registered-member' component={EventMemberListPage} />
        <ContentRoute role='0,1' exact path='/event/comments/:id' component={CommentEventList} />

        <ContentRoute exact path='/administrator' component={AdministratorListPage} />
        <ContentRoute exact path='/administrator/create' component={AdministratorAddPage} />
        <ContentRoute exact path='/administrator/:id/update' component={AdministratorEditPage} />

        <ContentRoute role='0' exact path='/jabatan' component={JabatanListPage} />
        <ContentRoute role='0' exact path='/jabatan/create' component={JabatanAddPage} />
        <ContentRoute role='0' exact path='/jabatan/:id/update' component={JabatanEditPage} />

        <ContentRoute exact path='/region-administrator/:id' component={RegionAdministratorListPage} />
        <ContentRoute exact path='/region-administrator/:id/create' component={RegionAdministratorAddPage} />
        <ContentRoute exact path='/region-administrator/:id/update' component={RegionAdministratorEditPage} />

        <ContentRoute exact path='/member' component={MemberListPage} />
        <ContentRoute exact path='/member/:id/detail' component={MemberDetailPage} />
        <ContentRoute exact path='/member/:id/update' component={MemberEditPage} />
        <ContentRoute exact path='/member/bulk-create' component={MemberBulkCreatePage} />
        <ContentRoute exact path='/member/create' component={MemberCreate} />
        <ContentRoute exact path='/member/upload' component={UploadMember} />
        {/* pengurus */}
        <ContentRoute exact path='/pengurus' component={PengurusList} />
        <ContentRoute exact path='/pengurus/create' component={PengurusAddPage} />
        <ContentRoute exact path='/pengurus/:id/detail' component={PengurusEditPage} />

        <ContentRoute role='0,7' exact path='/web-app-settings' component={WebAppSettings} />

        <ContentRoute role='0,7' exact path='/commission' component={CommissionListPage} />
        <ContentRoute role='0,7' exact path='/commission/create' component={CommissionAddPage} />
        <ContentRoute role='0,7' exact path='/commission/:id/update' component={CommissionEditPage} />
        <ContentRoute
          role='0,7'
          exact
          path='/commission/:id/parent-organization'
          component={CommissionMainOrganizationListPage}
        />

        <ContentRoute exact path='/status-organization' component={StatusOrganizationListPage} />
        <ContentRoute exact path='/status-organization/create' component={StatusOrganizationAddPage} />
        <ContentRoute exact path='/status-organization/:id/update' component={StatusOrganizationEditPage} />

        <ContentRoute role='0,1,7' exact path='/main-organization' component={MainOrganizationListPage} />
        <ContentRoute role='0,1,7' exact path='/main-organization/create' component={MainOrganizationAddPage} />
        <ContentRoute role='0,1,7' exact path='/main-organization/:id/update' component={MainOrganizationEditPage} />

        <ContentRoute exact path='/cms-administrator' component={CmsAdministratorListPage} />
        <ContentRoute exact path='/cms-administrator/create' component={CmsAdministratorAddPage} />
        <ContentRoute exact path='/cms-administrator/:id/update' component={CmsAdministratorEditPage} />
        <ContentRoute exact path='/cms-administrator/:id/detail' component={CmsAdministratorDetailPage} />

        <ContentRoute exact path='/transaction' component={TransactionListPage} />
        <ContentRoute exact path='/transaction/:order_id' component={TransactionInvoicePage} />

        <ContentRoute exact path='/payment-checkout' component={PaymentCheckoutPage} />

        {/* <ContentRoute path="/status-organization" component={StatusOrganizationPage} /> */}
        <ContentRoute path='/numbering' component={MemberNumberingPage} />
        <ContentRoute exact path='/add/member' component={AddMemberPage} />
        <ContentRoute exact path='/add/main-organization' component={AddMainOrganizationPage} />
        <ContentRoute exact path='/add/admin' component={AddAdminPage} />
        <ContentRoute exact path='/add/commission' component={AddCommissionPage} />
        <ContentRoute exact path='/add/status-organization' component={AddOrganizationStatus} />

        <ContentRoute exact path='/edit/commission' component={EditCommission} />
        <ContentRoute exact path='/edit/status-organization' component={EditOrganizationStatus} />
        <ContentRoute exact path='/edit/main-organization' component={EditMainOrganization} />

        <ContentRoute exact path='/reset-password' component={ResetPasswordPage} />

        <Route path='/google-material' component={GoogleMaterialPage} />
        <Route path='/react-bootstrap' component={ReactBootstrapPage} />
        <Route path='/e-commerce' component={ECommercePage} />
        <Route path='/user-profile' component={UserProfilepage} />
        <Redirect to='error/error-v1' />
      </Switch>
    </Suspense>
  );
}
