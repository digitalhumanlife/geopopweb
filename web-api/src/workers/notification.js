const { getNotifications } = require('../db/queries');
const { toStringByFormatting } = require('../utils/utils');
const { sendMail, sendSms } = require('../services/support');
const { setSendNotification } = require('../services/notification');
// async function

async function sendNotification() {
  await sendEmailNotification();
  await sendSmsNotification();
}

// 이메일 알림 전송
async function sendEmailNotification() {
  const currentDate = toStringByFormatting(new Date());

  // 오늘에 해당되는 날짜에 대한 알람들을 가져온다
  const notifications = await getNotifications(currentDate, 'email');

  if (notifications.length === 0) {
    return;
  }

  // 알람을 보낸다
  for (let i = 0; i < notifications.length; i++) {
    const title = String(notifications[i].title);
    const name = String(notifications[i].name);
    const email = String(notifications[i].to_target);
    const user_id = parseInt(notifications[i].user_id);
    const investment_id = parseInt(notifications[i].investment_id);
    const type = String(notifications[i].type);

    let content = ` ${name} 고객님. `;
    content += ` ${title} 모집이 시작되었습니다. `;
    content += ` 아래 링크를 통해 자세한 내용 확인이 가능합니다. `;
    content += ` <a href="https://www.geopop.co.kr/products/${investment_id}">https://www.geopop.co.kr</a> `;

    const mailPayload = {
      email: email,
      title: `[지오팝] ${title} 모집이 시작되었습니다.`,
      body: content,
    };
    // 알람을 보낸다
    try {
      await sendMail(mailPayload);
      // 알람을 보낸 날짜를 업데이트 한다
      await setSendNotification(user_id, investment_id, type);
    } catch (e) {
      console.log(e);
    }
  }
}

async function sendSmsNotification() {
  const currentDate = toStringByFormatting(new Date());

  // 오늘에 해당되는 날짜에 대한 알람들을 가져온다
  const notifications = await getNotifications(currentDate, 'sms');

  if (notifications.length === 0) {
    return;
  }

  // 알람을 보낸다
  for (let i = 0; i < notifications.length; i++) {
    const notification = notifications[i];
    let content = ` ${notification.name} 고객님. `;
    content += ` ${notification.title} 모집이 시작되었습니다. `;

    // 알람을 보낸다
    try {
      await sendSms(notification.phone, content);
      // 알람을 보낸 날짜를 업데이트 한다
      await setSendNotification(notification.user_id, notification.investment_id, notification.type);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = {
  sendNotification,
};
