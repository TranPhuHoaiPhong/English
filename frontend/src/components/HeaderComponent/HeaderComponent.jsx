function HeaderComponent() {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      left: 0,
      right: 0,
      background: "#001529",
      color: "#fff",
      padding: "15px 20px",
      fontSize: 18,
      fontWeight: "bold",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        Leave Management System

      </div>
    </div>
  );
}

export default HeaderComponent;