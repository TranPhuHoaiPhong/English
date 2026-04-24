import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";

function HomePage() {
  return (
    <>
      <HeaderComponent />
      <div style={{ padding: 20 }}>
        <h1>Welcome to HomePage</h1>
        <p>This is your main page.</p>
      </div>
    </>
  );
}

export default HomePage;