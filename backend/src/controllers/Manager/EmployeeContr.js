const logoutEmployee = async (req, res) => {
    try {

      res.clearCookie(
        "refreshToken",
        {
          httpOnly: true,
          secure:
            process.env
              .NODE_ENV ===
            "production",
          sameSite: "strict"
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Logout successful"
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
};

module.exports = {
  logoutEmployee
};