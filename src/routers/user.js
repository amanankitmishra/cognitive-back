const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const { singleUpload } = require("../middleware/uploadImages");
const fs = require("fs");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const accessToken = await user.generateAuthToken();
    const newAbility = {
      action: "manage",
      subject: "all",
    };

    // Adding the ability to the user's ability array
    user.ability.push(newAbility);

    // Saving the user with the updated ability array
    await user.save();
    res.status(201).send({ userData:user, accessToken });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const accessToken = await user.generateAuthToken();
    res.send({ userData:user, accessToken });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users/addAbility", auth, async (req, res) => {
  try {
    // Find the authenticated user
    const user = req.user;

    // Define the ability to be added
    const newAbility = {
      action: "manage",
      subject: "all",
    };

    // Add the ability to the user's ability array
    user.ability.push(newAbility);

    // Save the user with the updated ability array
    await user.save();

    res.json({ message: "Ability Added Successfully", user: user.toJSON() });
  } catch (e) {
    res.status(400).send(e.message);
  }
});


router.post("/users/me/avatar", auth, async (req, res) => {
  singleUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (req.user.avatar) {
      try {
        fs.unlinkSync(req.user.avatar);
      } catch (error) {
        console.log("Failed to remove previous avatar file:", error);
      }
    }
    req.user.avatar = req.filePath;
    await req.user.save();

    res.json({ message: "Avatar Added Successfully" });
  });
});
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      return res.status(404).json({ error: "No avatar found for the user" });
    }
    fs.unlinkSync(req.user.avatar);
    req.user.avatar = undefined;
    await req.user.save();

    res.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    //   console.log('Failed to delete avatar:', error);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
});

// router.get('/users/:id', auth, async (req,res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age","role"];
  const isValidoperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidoperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete('/users/me', auth, async (req, res) => {
//     try {
//         await req.user.remove()
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.get('/users/logs', auth, async (req,res) => {
//     try {
//         await req.user.populate('logs').execPopulate()
//         res.send(req.user.logs)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router;
