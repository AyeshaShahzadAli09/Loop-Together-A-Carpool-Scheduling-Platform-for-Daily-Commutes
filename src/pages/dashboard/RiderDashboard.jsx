<NavItem
  active={activeTab === 'notifications'}
  onClick={() => setActiveTab('notifications')}
  whileHover={{ x: 5 }}
  whileTap={{ scale: 0.95 }}
>
  <Bell /> Notifications
</NavItem>

{activeTab === 'notifications' ? (
  <NotificationsPanel />
) : // other conditions... 