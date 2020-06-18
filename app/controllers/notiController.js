var Notification = require("../models/Notification");
var User = require("../models/User");
var Post = require("../models/Post");

exports.getAllNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .populate(
      "sourceUser",
      "-_id -email -password -createdAt -isVerified -followers -following -updatedAt -__v"
    )
    .populate({
      path: "sourceId",
      select: "-_id -content -user -createdAt -updatedAt",
      populate: {
        path: "tags",
        select: "-_user -_id -description -createdAt -updatedAt"
      }
    })
    .sort([["_id", -1]]);

  console.log(notifications);
  if (notifications)
    return res.status(200).json({ success: true, data: notifications });
};

exports.createNewNotification = async (io, data) => {
  const newNotification = new Notification(data);
  let notiTargetRole = data.notiTargetRole || ["ALL"];
  newNotification.notiTargetRole = notiTargetRole;
  await newNotification.save();

  const getSourceMaker = await User.findById(newNotification.sourceUser);

  return io.emit("event://send-fact", { Notification: newNotification });
};
