import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
const Index = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Dashboard'));
  });

  const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  //Revenue Chart
  const revenueChart: any = {
    series: [
      {
        name: 'Income',
        data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
      },
      {
        name: 'Expenses',
        data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
      },
    ],
    options: {
      chart: {
        height: 325,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',
        width: 2,
        lineCap: 'square',
      },
      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: '#1B55E2',
            strokeColor: 'transparent',
            size: 7,
          },
          {
            seriesIndex: 1,
            dataPointIndex: 5,
            fillColor: '#E7515A',
            strokeColor: 'transparent',
            size: 7,
          },
        ],
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: isRtl ? 2 : 0,
          offsetY: 5,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-title',
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (value: number) => {
            return value / 1000 + 'K';
          },
          offsetX: isRtl ? -30 : -10,
          offsetY: 0,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        opposite: isRtl ? true : false,
      },
      grid: {
        borderColor: isDark ? '#191E3A' : '#E0E6ED',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '16px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        marker: {
          show: true,
        },
        x: {
          show: false,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: isDark ? 0.19 : 0.28,
          opacityTo: 0.05,
          stops: isDark ? [100, 100] : [45, 100],
        },
      },
    },
  };

  //Sales By Category
  const salesByCategory: any = {
    series: [985, 737, 270],
    options: {
      chart: {
        type: 'donut',
        height: 460,
        fontFamily: 'Nunito, sans-serif',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 25,
        colors: isDark ? '#0e1726' : '#fff',
      },
      colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 50,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '29px',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '26px',
                color: isDark ? '#bfc9d4' : undefined,
                offsetY: 16,
                formatter: (val: any) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: 'Total',
                color: '#888ea8',
                fontSize: '29px',
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      labels: ['Apparel', 'Sports', 'Others'],
      states: {
        hover: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
      },
    },
  };

  return (
    <>
      <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Sales</span>
          </li>
        </ul>

        <div className="pt-5">
          <div className="mb-6 grid gap-6 xl:grid-cols-3">
            <div className="panel h-full xl:col-span-2">
              <div className="mb-5 flex items-center justify-between dark:text-white-light">
                <h5 className="text-lg font-semibold">Revenue</h5>
                <div className="dropdown">
                  <Dropdown
                    offset={[0, 1]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    button={
                      <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    }
                  >
                    <ul>
                      <li>
                        <button type="button">Weekly</button>
                      </li>
                      <li>
                        <button type="button">Monthly</button>
                      </li>
                      <li>
                        <button type="button">Yearly</button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
              </div>
              <p className="text-lg dark:text-white-light/90">
                Total Profit <span className="ml-2 text-primary">$10,840</span>
              </p>
              <div className="relative">
                <div className="rounded-lg bg-white dark:bg-black">
                  {isMounted ? (
                    <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} width={'100%'} />
                  ) : (
                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="panel h-full">
              <div className="mb-5 flex items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Sales By Category</h5>
              </div>
              <div>
                <div className="rounded-lg bg-white dark:bg-black">
                  {isMounted ? (
                    <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                  ) : (
                    <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                      <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="panel h-full w-full">
              <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                      <th>Product</th>
                      <th>Invoice</th>
                      <th>Price</th>
                      <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="min-w-[150px] text-black dark:text-white">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-6.jpeg" alt="avatar" />
                          <span className="whitespace-nowrap">Luke Ivory</span>
                        </div>
                      </td>
                      <td className="text-primary">Headphone</td>
                      <td>
                        <Link href="/apps/invoice/preview">#46894</Link>
                      </td>
                      <td>$56.07</td>
                      <td>
                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-7.jpeg" alt="avatar" />
                          <span className="whitespace-nowrap">Andy King</span>
                        </div>
                      </td>
                      <td className="text-info">Nike Sport</td>
                      <td>
                        <Link href="/apps/invoice/preview">#76894</Link>
                      </td>
                      <td>$126.04</td>
                      <td>
                        <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Shipped</span>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-8.jpeg" alt="avatar" />
                          <span className="whitespace-nowrap">Laurie Fox</span>
                        </div>
                      </td>
                      <td className="text-warning">Sunglasses</td>
                      <td>
                        <Link href="/apps/invoice/preview">#66894</Link>
                      </td>
                      <td>$56.07</td>
                      <td>
                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-9.jpeg" alt="avatar" />
                          <span className="whitespace-nowrap">Ryan Collins</span>
                        </div>
                      </td>
                      <td className="text-danger">Sport</td>
                      <td>
                        <button type="button">#75844</button>
                      </td>
                      <td>$110.00</td>
                      <td>
                        <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Shipped</span>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-10.jpeg" alt="avatar" />
                          <span className="whitespace-nowrap">Irene Collins</span>
                        </div>
                      </td>
                      <td className="text-secondary">Speakers</td>
                      <td>
                        <Link href="/apps/invoice/preview">#46894</Link>
                      </td>
                      <td>$56.07</td>
                      <td>
                        <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel h-full w-full">
              <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Top Selling Product</h5>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr className="border-b-0">
                      <th className="ltr:rounded-l-md rtl:rounded-r-md">Product</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Sold</th>
                      <th className="ltr:rounded-r-md rtl:rounded-l-md">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="min-w-[150px] text-black dark:text-white">
                        <div className="flex">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-headphones.jpg" alt="avatar" />
                          <p className="whitespace-nowrap">
                            Headphone
                            <span className="block text-xs text-primary">Digital</span>
                          </p>
                        </div>
                      </td>
                      <td>$168.09</td>
                      <td>$60.09</td>
                      <td>170</td>
                      <td>
                        <button type="button" className="flex items-center text-danger">
                          <svg className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.6644 5.47875L16.6367 9.00968C18.2053 10.404 18.9896 11.1012 18.9896 11.9993C18.9896 12.8975 18.2053 13.5946 16.6367 14.989L12.6644 18.5199C11.9484 19.1563 11.5903 19.4746 11.2952 19.342C11 19.2095 11 18.7305 11 17.7725V15.4279C7.4 15.4279 3.5 17.1422 2 19.9993C2 10.8565 7.33333 8.57075 11 8.57075V6.22616C11 5.26817 11 4.78917 11.2952 4.65662C11.5903 4.52407 11.9484 4.8423 12.6644 5.47875Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              opacity="0.5"
                              d="M15.5386 4.5L20.7548 9.34362C21.5489 10.081 22.0001 11.1158 22.0001 12.1994C22.0001 13.3418 21.4989 14.4266 20.629 15.1671L15.5386 19.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Direct
                        </button>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-shoes.jpg" alt="avatar" />
                          <p className="whitespace-nowrap">
                            Shoes <span className="block text-xs text-warning">Faishon</span>
                          </p>
                        </div>
                      </td>
                      <td>$126.04</td>
                      <td>$47.09</td>
                      <td>130</td>
                      <td>
                        <button type="button" className="flex items-center text-success">
                          <svg className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.6644 5.47875L16.6367 9.00968C18.2053 10.404 18.9896 11.1012 18.9896 11.9993C18.9896 12.8975 18.2053 13.5946 16.6367 14.989L12.6644 18.5199C11.9484 19.1563 11.5903 19.4746 11.2952 19.342C11 19.2095 11 18.7305 11 17.7725V15.4279C7.4 15.4279 3.5 17.1422 2 19.9993C2 10.8565 7.33333 8.57075 11 8.57075V6.22616C11 5.26817 11 4.78917 11.2952 4.65662C11.5903 4.52407 11.9484 4.8423 12.6644 5.47875Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              opacity="0.5"
                              d="M15.5386 4.5L20.7548 9.34362C21.5489 10.081 22.0001 11.1158 22.0001 12.1994C22.0001 13.3418 21.4989 14.4266 20.629 15.1671L15.5386 19.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Google
                        </button>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-watch.jpg" alt="avatar" />
                          <p className="whitespace-nowrap">
                            Watch <span className="block text-xs text-danger">Accessories</span>
                          </p>
                        </div>
                      </td>
                      <td>$56.07</td>
                      <td>$20.00</td>
                      <td>66</td>
                      <td>
                        <button type="button" className="flex items-center text-warning">
                          <svg className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.6644 5.47875L16.6367 9.00968C18.2053 10.404 18.9896 11.1012 18.9896 11.9993C18.9896 12.8975 18.2053 13.5946 16.6367 14.989L12.6644 18.5199C11.9484 19.1563 11.5903 19.4746 11.2952 19.342C11 19.2095 11 18.7305 11 17.7725V15.4279C7.4 15.4279 3.5 17.1422 2 19.9993C2 10.8565 7.33333 8.57075 11 8.57075V6.22616C11 5.26817 11 4.78917 11.2952 4.65662C11.5903 4.52407 11.9484 4.8423 12.6644 5.47875Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              opacity="0.5"
                              d="M15.5386 4.5L20.7548 9.34362C21.5489 10.081 22.0001 11.1158 22.0001 12.1994C22.0001 13.3418 21.4989 14.4266 20.629 15.1671L15.5386 19.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Ads
                        </button>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-laptop.jpg" alt="avatar" />
                          <p className="whitespace-nowrap">
                            Laptop <span className="block text-xs text-primary">Digital</span>
                          </p>
                        </div>
                      </td>
                      <td>$110.00</td>
                      <td>$33.00</td>
                      <td>35</td>
                      <td>
                        <button type="button" className="flex items-center text-secondary">
                          <svg className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.6644 5.47875L16.6367 9.00968C18.2053 10.404 18.9896 11.1012 18.9896 11.9993C18.9896 12.8975 18.2053 13.5946 16.6367 14.989L12.6644 18.5199C11.9484 19.1563 11.5903 19.4746 11.2952 19.342C11 19.2095 11 18.7305 11 17.7725V15.4279C7.4 15.4279 3.5 17.1422 2 19.9993C2 10.8565 7.33333 8.57075 11 8.57075V6.22616C11 5.26817 11 4.78917 11.2952 4.65662C11.5903 4.52407 11.9484 4.8423 12.6644 5.47875Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              opacity="0.5"
                              d="M15.5386 4.5L20.7548 9.34362C21.5489 10.081 22.0001 11.1158 22.0001 12.1994C22.0001 13.3418 21.4989 14.4266 20.629 15.1671L15.5386 19.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Email
                        </button>
                      </td>
                    </tr>
                    <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                      <td className="text-black dark:text-white">
                        <div className="flex">
                          <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-camera.jpg" alt="avatar" />
                          <p className="whitespace-nowrap">
                            Camera <span className="block text-xs text-primary">Digital</span>
                          </p>
                        </div>
                      </td>
                      <td>$56.07</td>
                      <td>$26.04</td>
                      <td>30</td>
                      <td>
                        <button type="button" className="flex items-center text-primary">
                          <svg className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M12.6644 5.47875L16.6367 9.00968C18.2053 10.404 18.9896 11.1012 18.9896 11.9993C18.9896 12.8975 18.2053 13.5946 16.6367 14.989L12.6644 18.5199C11.9484 19.1563 11.5903 19.4746 11.2952 19.342C11 19.2095 11 18.7305 11 17.7725V15.4279C7.4 15.4279 3.5 17.1422 2 19.9993C2 10.8565 7.33333 8.57075 11 8.57075V6.22616C11 5.26817 11 4.78917 11.2952 4.65662C11.5903 4.52407 11.9484 4.8423 12.6644 5.47875Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              opacity="0.5"
                              d="M15.5386 4.5L20.7548 9.34362C21.5489 10.081 22.0001 11.1158 22.0001 12.1994C22.0001 13.3418 21.4989 14.4266 20.629 15.1671L15.5386 19.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Referral
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie('users', { req, res });
  if (!token) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  return {
    props: {}, // will be passed to the page component as props
  };
};

export default Index;
