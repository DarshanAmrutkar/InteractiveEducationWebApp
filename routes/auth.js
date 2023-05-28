const router = require("express").Router();
const passport = require("passport");
const User=require("../models/User")

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
}), async (req, res) => {
    try {
        const { name, email } = req.user;
        const user = await User.findOne({ email });
        if (user) {
            user.authMethod = "google";
            user.googleId = req.user.id;
            await user.save();
        } else {
            const newUser = new User({
                name,
                email,
                authMethod: "google",
                googleId: req.user.id,
				avatarUrl:null,
				avatarId:null
            });
            await newUser.save();
        }
        const token = jwt.sign({ userId: user._id }, "helloiamsecret", { expiresIn: '1h' });

        // Return the token and other user data in the response
        res.redirect(process.env.CLIENT_URL).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,

                // Include any other relevant user data
            },
            
        });
       
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;