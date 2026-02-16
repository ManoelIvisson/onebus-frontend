import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import styles from './MainLayout.module.css';

function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>

        <header className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <div className={styles.sidebarLogoIcon}>
              <i className='fas fa-bus'></i>
            </div>
            <span className={styles.sidebarLogoText}>OneBus</span>
          </div>
          <button className={styles.toggleBtn} onClick={toggleSidebar}>
            <i className='fas fa-angle-left'
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            ></i>
          </button>
        </header>

        <nav className={styles.sidebarMenu}>
          <NavLink to="/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <div className={styles.menuIcon}>
              <i className='fas fa-tachometer-alt'></i>
            </div>
            <span className={styles.menuText}>Dashboard</span>
          </NavLink>
          <NavLink to="/rotas" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <div className={styles.menuIcon}>
              <i className='fas fa-route'></i>
            </div>
            <span className={styles.menuText}>Rotas</span>
          </NavLink>
          <NavLink to="/frotas" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <div className={styles.menuIcon}>
              <i className='fas fa-bus-side'></i>
            </div>
            <span className={styles.menuText}>Frotas</span>
          </NavLink>
          <NavLink to="/relatorios" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            <div className={styles.menuIcon}>
              <i className='fas fa-chart-line'></i>
            </div>
            <span className={styles.menuText}>Relatórios</span>
          </NavLink>
        </nav>

      </aside>

      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;