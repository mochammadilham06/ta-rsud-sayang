import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Sidebar = ({ userType }: any) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const [tempUserType, setUserType] = useState('');
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    if (selector) {
      selector.classList.add('active');
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [router.pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll('.sidebar ul a.active');
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove('active');
    }
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
    selector?.classList.add('active');
  };

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    setUserType(userType);
  }, [userType]);

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="main-logo flex shrink-0 items-center">
              <img className="ml-[5px] w-8 flex-none" src="/assets/images/rsud.png" alt="logo" />
              <span className="align-middle text-2xl font-semibold dark:text-white-light lg:inline ltr:ml-1.5 rtl:mr-1.5">{t('SI Radiologi')}</span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <svg className="hidden h-5 w-4 flex-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>{t('DAFTAR MENU')}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <Link href="/" className="group">
                      <div className="flex items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            opacity="0.5"
                            d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                            fill="#1C274C"
                          />
                          <path
                            d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                            fill="#1C274C"
                          />
                        </svg>

                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Dashboard')}</span>
                      </div>
                    </Link>
                  </li>
                  {userType === 'pasien' && (
                    <>
                      <li className="nav-item">
                        <Link href="/users/register-medical" className="group">
                          <div className="flex items-center">
                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                opacity="0.5"
                                d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
                                fill="currentColor"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.25 12C7.25 11.5858 7.58579 11.25 8 11.25H16C16.4142 11.25 16.75 11.5858 16.75 12C16.75 12.4142 16.4142 12.75 16 12.75H8C7.58579 12.75 7.25 12.4142 7.25 12Z"
                                fill="currentColor"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.25 8C7.25 7.58579 7.58579 7.25 8 7.25H16C16.4142 7.25 16.75 7.58579 16.75 8C16.75 8.41421 16.4142 8.75 16 8.75H8C7.58579 8.75 7.25 8.41421 7.25 8Z"
                                fill="currentColor"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.25 16C7.25 15.5858 7.58579 15.25 8 15.25H13C13.4142 15.25 13.75 15.5858 13.75 16C13.75 16.4142 13.4142 16.75 13 16.75H8C7.58579 16.75 7.25 16.4142 7.25 16Z"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Pendaftaran Radiologi')}</span>
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="/users/medical-checkup-workflow" className="group">
                          <div className="flex items-center">
                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z" fill="currentColor" />
                              <path
                                d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z"
                                fill="currentColor"
                              />
                              <path
                                d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z"
                                fill="currentColor"
                              />
                              <path
                                opacity="0.5"
                                d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Cek Status Pendaftaran')}</span>
                          </div>
                        </Link>
                      </li>
                    </>
                  )}
                  {userType === 'dokter-poli' && (
                    <li className="nav-item">
                      <Link href="/doctor/approval-task" className="group">
                        <div className="flex items-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2.54497 8.73005C2 9.79961 2 11.1997 2 14C2 16.8003 2 18.2004 2.54497 19.27C3.02433 20.2108 3.78924 20.9757 4.73005 21.455C5.79961 22 7.19974 22 10 22H14C16.8003 22 18.2004 22 19.27 21.455C20.2108 20.9757 20.9757 20.2108 21.455 19.27C22 18.2004 22 16.8003 22 14C22 11.1997 22 9.79961 21.455 8.73005C20.9757 7.78924 20.2108 7.02433 19.27 6.54497C18.2004 6 16.8003 6 14 6H10C7.19974 6 5.79961 6 4.73005 6.54497C3.78924 7.02433 3.02433 7.78924 2.54497 8.73005ZM15.0595 12.4995C15.3353 12.1905 15.3085 11.7164 14.9995 11.4406C14.6905 11.1647 14.2164 11.1915 13.9406 11.5005L10.9286 14.8739L10.0595 13.9005C9.78359 13.5915 9.30947 13.5647 9.0005 13.8406C8.69152 14.1164 8.66468 14.5905 8.94055 14.8995L10.3691 16.4995C10.5114 16.6589 10.7149 16.75 10.9286 16.75C11.1422 16.75 11.3457 16.6589 11.488 16.4995L15.0595 12.4995Z"
                              fill="#1C274C"
                            />
                            <path
                              opacity="0.5"
                              d="M11.9993 2C16.7133 2 19.0704 2 20.5348 3.46447C21.2923 4.22195 21.658 5.21824 21.8345 6.65598V10H2.16406V6.65598C2.3406 5.21824 2.70628 4.22195 3.46377 3.46447C4.92823 2 7.28525 2 11.9993 2Z"
                              fill="#1C274C"
                            />
                          </svg>

                          <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Persetujuan Rekam Medis')}</span>
                        </div>
                      </Link>
                    </li>
                  )}
                  {userType === 'dokter-radiologi' && (
                    <li className="nav-item">
                      <Link href="/doctor/view-diagnoses" className="group">
                        <div className="flex items-center">
                          <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              opacity="0.5"
                              d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z"
                              fill="currentColor"
                            />
                            <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="currentColor" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V12.25L15 12.25C15.4142 12.25 15.75 12.5858 15.75 13C15.75 13.4142 15.4142 13.75 15 13.75L12.75 13.75L12.75 16C12.75 16.4142 12.4142 16.75 12 16.75C11.5858 16.75 11.25 16.4142 11.25 16L11.25 13.75H9C8.58579 13.75 8.25 13.4142 8.25 13C8.25 12.5858 8.58579 12.25 9 12.25L11.25 12.25L11.25 10C11.25 9.58579 11.5858 9.25 12 9.25Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Lihat Diagnosa Pasien')}</span>
                        </div>
                      </Link>
                    </li>
                  )}

                  {userType === 'admin' && (
                    <>
                      <li className="nav-item">
                        <Link href="/admin/manage-pasien" className="group">
                          <div className="flex items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M2 17.5C2 15.0147 4.01472 13 6.5 13H9.2C9.83006 13 10.1451 13 10.3857 13.1226C10.5974 13.2305 10.7695 13.4026 10.8774 13.6143C11 13.8549 11 14.1699 11 14.8V17.5C11 19.9853 8.98528 22 6.5 22C4.01472 22 2 19.9853 2 17.5Z"
                                fill="#1C274C"
                              />
                              <path
                                d="M13 6.5C13 4.01472 15.0147 2 17.5 2C19.9853 2 22 4.01472 22 6.5C22 8.98528 19.9853 11 17.5 11H14.2857C14.1365 11 14.0618 11 13.999 10.9929C13.4775 10.9342 13.0658 10.5225 13.0071 10.001C13 9.93818 13 9.86355 13 9.71429V6.5Z"
                                fill="#1C274C"
                              />
                              <g opacity="0.5">
                                <path
                                  d="M2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5V9.5C11 9.84874 11 10.0231 10.9617 10.1662C10.8576 10.5544 10.5544 10.8576 10.1662 10.9617C10.0231 11 9.84874 11 9.5 11H6.5C4.01472 11 2 8.98528 2 6.5Z"
                                  fill="#1C274C"
                                />
                                <path
                                  d="M13 14.5C13 14.1513 13 13.9769 13.0383 13.8338C13.1424 13.4456 13.4456 13.1424 13.8338 13.0383C13.9769 13 14.1513 13 14.5 13H17.5C19.9853 13 22 15.0147 22 17.5C22 19.9853 19.9853 22 17.5 22C15.0147 22 13 19.9853 13 17.5V14.5Z"
                                  fill="#1C274C"
                                />
                              </g>
                            </svg>

                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Kelola Data')}</span>
                          </div>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="/admin/upload-result" className="group">
                          <div className="flex items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                opacity="0.5"
                                d="M22 15.9998V14.9998C22 12.1714 21.9998 10.7576 21.1211 9.87891C20.2424 9.00023 18.8282 9.00023 15.9998 9.00023H7.99977C5.17135 9.00023 3.75713 9.00023 2.87845 9.87891C2 10.7574 2 12.1706 2 14.9976V14.9998V15.9998C2 18.8282 2 20.2424 2.87868 21.1211C3.75736 21.9998 5.17157 21.9998 8 21.9998H16H16C18.8284 21.9998 20.2426 21.9998 21.1213 21.1211C22 20.2424 22 18.8282 22 15.9998Z"
                                fill="#1C274C"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 4.02744L14.4306 5.98809C14.7001 6.30259 15.1736 6.33901 15.4881 6.06944C15.8026 5.79988 15.839 5.3264 15.5695 5.01191L12.5695 1.51191C12.427 1.34567 12.219 1.25 12 1.25C11.7811 1.25 11.5731 1.34567 11.4306 1.51191L8.43057 5.01191C8.161 5.3264 8.19743 5.79988 8.51192 6.06944C8.82641 6.33901 9.29989 6.30259 9.56946 5.98809L11.25 4.02744L11.25 15C11.25 15.4142 11.5858 15.75 12 15.75Z"
                                fill="#1C274C"
                              />
                            </svg>

                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Upload data rekam medis')}</span>
                          </div>
                        </Link>
                      </li>

                      <li className="nav-item">
                        <Link href="/admin/manage-registerer" className="group">
                          <div className="flex items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                opacity="0.5"
                                d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                fill="#1C274C"
                              />
                              <path
                                d="M15.0994 12.0936C14.9145 11.7917 14.7343 11.4973 14.558 11.2865C14.3708 11.0629 14.0427 10.7552 13.541 10.7754C13.0392 10.7955 12.7369 11.1284 12.5682 11.3664C12.4094 11.5905 12.2533 11.8984 12.0933 12.2141L12.0933 12.2142L10.1054 16.1339C10.0303 16.2819 9.96781 16.4052 9.91157 16.5111C9.84318 16.4126 9.76649 16.2976 9.67443 16.1595L9.49755 15.8942C9.2942 15.5891 9.11407 15.3189 8.9414 15.1058C8.75414 14.8747 8.54321 14.6683 8.2589 14.5162C7.9746 14.364 7.6859 14.303 7.38972 14.2754C7.11663 14.2499 6.79189 14.2499 6.42526 14.25L5 14.25C4.58579 14.25 4.25 14.5857 4.25 15C4.25 15.4142 4.58579 15.75 5 15.75H6.39445C6.80113 15.75 7.0553 15.7507 7.25047 15.7689C7.43017 15.7857 7.50379 15.8134 7.55112 15.8387C7.59845 15.864 7.66234 15.9099 7.77596 16.0501C7.89936 16.2024 8.04097 16.4135 8.26656 16.7519L8.4526 17.031C8.64087 17.3135 8.8261 17.5915 9.00554 17.7898C9.1984 18.003 9.52819 18.2871 10.0153 18.2582C10.5025 18.2293 10.7963 17.9081 10.9626 17.6736C11.1173 17.4554 11.2683 17.1574 11.4218 16.8546L13.4092 12.9357C13.4876 12.7812 13.553 12.6523 13.6119 12.5415C13.6794 12.6472 13.7549 12.7704 13.8454 12.9182L14.4994 13.9859C14.6995 14.3127 14.8766 14.6018 15.0485 14.8299C15.2348 15.0773 15.4477 15.2988 15.7406 15.4629C16.0336 15.6271 16.3337 15.6928 16.642 15.7226C16.9263 15.75 17.2653 15.75 17.6485 15.75L19 15.75C19.4142 15.75 19.75 15.4142 19.75 15C19.75 14.5857 19.4142 14.25 19 14.25H17.6805C17.2557 14.25 16.9897 14.2491 16.786 14.2295C16.5983 14.2114 16.5223 14.1815 16.4737 14.1543C16.4251 14.1271 16.36 14.0779 16.2465 13.9273C16.1233 13.7638 15.9837 13.5374 15.7618 13.1752L15.0994 12.0936Z"
                                fill="#1C274C"
                              />
                            </svg>

                            <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('Proses Rekam Medis')}</span>
                          </div>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
