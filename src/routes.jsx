/* eslint-disable react/no-array-index-key */
import React, { Suspense, lazy } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

// const Main = lazy(() => import('components/Main/Main'));
const Home = lazy(() => import('pages/Home/Home'));
const Login = lazy(() => import('pages/Login/Login'));
const ProductList = lazy(() => import('pages/Product/List/List'));
const ProductItem = lazy(() => import('pages/Product/Item/Item'));
const NewsList = lazy(() => import('pages/News/List/List'));
const NewsItem = lazy(() => import('pages/News/Item/Item'));
const Join = lazy(() => import('pages/Join/Join'));
const Checkstand = lazy(() => import('pages/Checkstand/Checkstand'));
const Logistics = lazy(() => import('pages/Logistics/Logistics'));
const AddressList = lazy(() => import('pages/Address/Management/Management'));
const NewAddress = lazy(() => import('pages/Address/NewAddress/NewAddress'));
const Order = lazy(() => import('pages/Order/Order/Order'));
const OrderList = lazy(() => import('pages/Order/List/List'));
const Refund = lazy(() => import('pages/Order/Refund/Refund'));
const SalesReturn = lazy(() => import('pages/Order/SalesReturn/SalesReturn'));
const UserCenter = lazy(() => import('pages/UserCenter/UserCenter'));
const ShoppingCart = lazy(() => import('pages/ShoppingCart/ShoppingCart'));
const Confirm = lazy(() => import('pages/Confirm/Confirm'));
const CouponCenter = lazy(() => import('pages/Coupon/Center/Center'));
const Coupons = lazy(() => import('pages/Coupon/List/List'));
const SelectCoupon = lazy(() => import('pages/Coupon/Select/Select'));
const Information = lazy(() => import('pages/Information/Information'));
const Evaluate = lazy(() => import('pages/Evaluate/Evaluate'));
const Comment = lazy(() => import('pages/Comment/Comment'));

export default (
  <HashRouter>
    <Suspense fallback={<div />}>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/products" component={ProductList} exact />
        <Route path="/product" component={ProductItem} exact />
        <Route path="/news" component={NewsList} exact />
        <Route path="/new" component={NewsItem} exact />
        <Route path="/join" component={Join} exact />
        <Route path="/checkstand" component={Checkstand} exact />
        <Route path="/logistics" component={Logistics} exact />
        <Route path="/address" component={AddressList} exact />
        <Route path="/newAddress" component={NewAddress} exact />
        <Route path="/order" component={Order} exact />
        <Route path="/orders" component={OrderList} exact />
        <Route path="/refund" component={Refund} exact />
        <Route path="/salesReturn" component={SalesReturn} exact />
        <Route path="/userCenter" component={UserCenter} exact />
        <Route path="/shoppingCart" component={ShoppingCart} exact />
        <Route path="/confirm" component={Confirm} exact />
        <Route path="/couponCenter" component={CouponCenter} exact />
        <Route path="/coupons" component={Coupons} exact />
        <Route path="/selectCoupon" component={SelectCoupon} exact />
        <Route path="/information" component={Information} exact />
        <Route path="/evaluate" component={Evaluate} exact />
        <Route path="/comment" component={Comment} exact />
      </Switch>
    </Suspense>
  </HashRouter>
);
