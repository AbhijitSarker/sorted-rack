
const login = (userId, email, role, branch) => {
  localStorage.setItem("user", JSON.stringify({ userId, email, role, branch }));
  if (role === "superadmin") {
    window.location.href = "localhost:3000/stock";
  }
};

const getUserDetails = () => {
  return localStorage.getItem("userDetails") && JSON.parse(localStorage.getItem("userDetails")) || {};
};

const isLoggedIn = () => {
  return localStorage.getItem("userDetails") || false;
}
const logout = () => {
  localStorage.removeItem("userDetails");
};

export { login, getUserDetails, isLoggedIn, logout };
