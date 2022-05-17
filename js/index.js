import { videoBase64 } from "./videobase64.js";
import { imgBase64 } from "./imgbase64.js";

const APP_ID = '3ee30362-8459-4ff8-b69c-091be04cfd7a';
const DEMO_CHANNEL_ID = 'demo_channel';

const avatarUser = [
	{username : '제임스', image : './images/user_0.png'},
	{username : '팀', image : './images/user_1.png'},
	{username : '에이미', image : './images/user_2.png'},
	{username : '엠마', image : './images/user_3.png'},
	{username : '니콜', image : './images/user_4.png'},
	{username : '대니얼', image : './images/user_5.png'},
	{username : '토마스', image : './images/user_6.png'},
	{username : '마이클', image : './images/user_7.png'},
	{username : '잭슨', image : './images/user_8.png'},
	{username : '마일로', image : './images/user_9.png'},
	{username : '조이', image : './images/user_10.png'},
	{username : '제이미', image : './images/user_11.png'},
	{username : '조지', image : './images/user_12.png'},
	{username : '케이트', image : './images/user_13.png'},
	{username : '아이반', image : './images/user_14.png'},
	{username : '칼', image : './images/user_15.png'},
	{username : '릴리', image : './images/user_16.png'},
	{username : '제시카', image : './images/user_17.png'},
	{username : '윌리엄', image : './images/user_18.png'},
	{username : '스칼렛', image : './images/user_19.png'},
];
let client;
let loginUserInfo = {};

const avatarhtml = function (message) {
	let pick = Math.floor(Math.random() * avatarUser.length);
	if (!message.profileImageUrl){
		message.profileImageUrl = avatarUser[pick].image;
	}
	let template = '';
	if (!message.fileUrl) {
		template = `
		<div class="message-list avatar">
			<div class="avatar-image"><img src="${message.profileImageUrl}" /></div>
			<div class="message-box">
				<div class="avatar-name">${message.username}</div>
				<div class="message-time">
					<div class="message-text">${message.text}</div>
					<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
				</div>
			</div>
		</div>`;
	} else {
		if (message.data.fileTypeLabel === 'video'){
			template =
				`<div class="message-list avatar">
				<div class="avatar-image"><img src="${message.profileImageUrl}" /></div>
				<div class="message-box">
					<div class="avatar-name">${message.username}</div>
					<div class="message-time">
						<div class="file-area video">
							<video width="304" controls>
								<source src="${message.fileUrl}" type="video/mp4">
							</video>
						</div>
						<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
					</div>
				</div>
			</div>`;
		} else if (message.data.fileTypeLabel === 'image') {
			template =
				`<div class="message-list avatar">
				<div class="avatar-image"><img src="${message.profileImageUrl}" /></div>
				<div class="message-box">
					<div class="avatar-name">${message.username}</div>
					<div class="message-time">
						<div class="file-area picture">
							<a href="${message.fileUrl}" target="_blank"><img src="${message.fileUrl}"/></a>
						</div>
						<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
					</div>
				</div>
			</div>`;
		} else {
			template =
			`<div class="message-list avatar">
				<div class="avatar-image"><img src="${message.profileImageUrl}" /></div>
				<div class="message-box">
					<div class="avatar-name">${message.username}</div>
					<div class="message-time">
						<div class="file-area file">
							<a href="${message.fileUrl}" target="_blank">
								<sapn class="fileName">${message.data.fileNameLabel}</sapn>
								<sapn class="fileSize">용량 : ${message.data.fileSizeLabel} Byte</sapn>
								<sapn class="filedown"></sapn>
							</a>
						</div>
						<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
					</div>
				</div>
			</div>`;
		}
	}
	return template;
};

const addMessagehtml = function (message) {
	return `
    <div class="message-list wirter">
		<div class="message-box">
			<div class="message-time">
				<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
				<div class="message-text">${message.text}</div>
			</div>
		</div>
	</div>`;
};

const addFilePicturehtml = function (message) {
	return `
    <div class="message-list wirter">
		<div class="message-box">
			<div class="message-time">
				<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
				<div class="file-area picture">
					<a href="${message.fileUrl}" target="_blank"><img src="${message.fileUrl}" /></a>
				</div>
			</div>
		</div>
	</div>`;
};

const addFileVideohtml = function (message) {
	return `
    <div class="message-list wirter">
		<div class="message-box">
			<div class="message-time">
				<div class="file-area video">
					<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
					<video width="304" controls>
						<source src="${message.fileUrl}" type="video/mp4">
					</video>
				</div>
			</div>
		</div>
	</div>`;
};

const addFilehtml = function (message) {
	return `
    <div class="message-list wirter">
		<div class="message-box">
			<div class="message-time">
				<div class="timestamps">${new Date(message.createdAt).toLocaleTimeString()}</div>
				<div class="file-area file">
					<a href="${message.fileUrl}" target="_blank">
						<sapn class="fileName">${message.data.fileNameLabel}</sapn>
						<sapn class="fileSize">용량 : ${message.data.fileSizeLabel} Byte</sapn>
						<sapn class="filedown"></sapn>
					</a>
				</div>
			</div>
		</div>
	</div>`;
};


$(document).ready(function () {
	//$('.chat-title').text(DEMO_CHANNEL_ID);
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const date = today.getDate();
	const dateText = `${year}년 ${month >= 10 ? month : '0' + month}월 ${date >= 10 ? date : '0' + date}일`;
	$('.chat-area .date').text(dateText);

	client = new TalkPlus.Client({appId: APP_ID});

	client.on('event', function (payload) {
		if (payload.type === 'message') {
			addMessage(payload.message);
		}
	});
	setupUsernameInputEventListener();
	sendMessageInputListener();
	sendMessageBtnListener();
	showAttechFilebox();
	sendFileImage();
	sendFileVideo();
	sendFileText();
});

function setupUsernameInputEventListener() {
	// login anonymously
	let pick = Math.floor(Math.random() * avatarUser.length);
	client.loginAnonymous({userId: generateRandomId(), username: avatarUser[pick].username, profileImageUrl: avatarUser[pick].image}, function (errResp, data) {
		loginUserInfo = data.user;

		$('.user-box .user-img').attr('src', loginUserInfo.profileImageUrl);
		$('.user-box .name input').val(loginUserInfo.username);

		//user name 변경.
		changeUserName(loginUserInfo);


		if (errResp) {
			return alert(JSON.stringify(errResp));
		}
		// join demo channel
		client.joinChannel({channelId: DEMO_CHANNEL_ID}, function (errResp, data) {
			if (errResp) {
				if (errResp.code === '2003') { // if channel not found, create it
					client.createChannel({
						channelId: DEMO_CHANNEL_ID,
						name: DEMO_CHANNEL_ID,
						type: 'super_public',
						members: []
					}, function (errResp, data) {
						if (errResp) {
							return alert(JSON.stringify(errResp));
						}
					});
				} else if (errResp.code === '2008') { // if user already had joined channel before, don't worry about error
					// don't handle
				} else {
					return alert(JSON.stringify(errResp));
				}
			}

			client.getMessages({channelId: DEMO_CHANNEL_ID}, function (errResp, data) {
				if (errResp) {
					return alert(JSON.stringify(errResp));
				}
				populateChatWindowWithMessages(data.messages);
			});
		});
	});
 }

function changeUserName(loginUserInfo){
	$(document).on('click', '.btn-alter', function(e){
		$(this).closest('.user-box').find('.name').addClass('active');
		$(this).closest('.user-box').find('.name input').focus();
	});
	$(document).on('focusout', '.user-box .name input', function(e){
		let newUserName = $(this).closest('.user-box').find('.name input').val();
		if (newUserName !== loginUserInfo.username){
			client.updateUser({
				username: newUserName,
			});
		}
		$(this).closest('.user-box').find('.name').removeClass('active');
	});
}

function sendMessageInputListener() {
	$(document).on('keypress', '.enterMessage', function (e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			const messageText = $('.enterMessage').val();
			$('.enterMessage').val('');
			addMessageText(messageText);
		}
	});
}

function sendMessageBtnListener() {
	$(document).on('click', '#btnEnterMessage', function (e) {
			e.preventDefault();
			const messageText = $('.enterMessage').val();
			$('.enterMessage').val('');
			addMessageText(messageText);
	});
}

function populateChatWindowWithMessages(messages) {
	let customMessages = messages.slice(-8, messages.length);
	for (let i = customMessages.length - 1; i >= 0; i--) {
		const message = messages[i];
		let html = '';
		html = avatarhtml(message);
		$('.message-area').append(html);
	}
	scrollDown();
}

function addMessageText(messageText) {
	client.sendMessage({channelId: DEMO_CHANNEL_ID, type: 'text', text: messageText}, function (err, data) {
		if (err) {
			return alert(err);
		}
		let html = '';
		html = addMessagehtml(data.message);
		$('.message-area').append(html);
		scrollDown();
	});
}

function addMessage(message) {
	let html = '';
	html = avatarhtml(message);
	$('.message-area').append(html);
	scrollDown();
}

function generateRandomString() {
	return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
}

function generateRandomId() {
	return generateRandomString() + '-' + generateRandomString() + '-' + generateRandomString();
}

function scrollDown() {
	$('#chatView').scrollTop($('#chatView')[0].scrollHeight);
}

function showAttechFilebox() {
	$('.btn-attach a').on('click', function () {
		$(this).addClass('active');
		$(this).closest('.message-write-inner').find('.attach-box').addClass('active');
	});
	$('.btn-attach a').on('focusout', function () {
		$(this).removeClass('active');
		$(this).closest('.message-write-inner').find('.attach-box').removeClass('active');
	});
}

function b64toBlob (b64Data, contentType = '', sliceSize = 512) {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

function dataURLtoFile (dataurl, fileName) {
	var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), 
			n = bstr.length, 
			u8arr = new Uint8Array(n);
			
	while(n--){
			u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, {type:mime});
}


function sendFileImage() {
	$('.attach-box .attach.pic').on('click', function () {
		let imgFile = dataURLtoFile(imgBase64,'TalkPlusSampleImage');
		let imgFileSize = String(imgFile.size);
		client.sendMessage({
			channelId: DEMO_CHANNEL_ID,
			type: 'text',
			text: '',
			data: { 'fileSizeLabel': imgFileSize, 'fileNameLabel': imgFile.name, fileTypeLabel: 'image' },
			file: imgFile,
		}, function (err, data) {
			if (err) {
				return alert(err);
			}
			let html = '';
			html = addFilePicturehtml(data.message);
			$('.message-area').append(html);
			scrollDown();
		});
	});
}


function sendFileVideo() {
	$('.attach-box .attach.video').on('click', function () {
		let videoUrl = 'https://d2qgyf3am7429y.cloudfront.net/video/talkplus.mp4';
		const blob = b64toBlob(videoBase64, 'video/mp4');

		let videoFile = new File([blob], "TalkPlusSampleVideo", { type: "video/mp4" });
		let videoFileSize = String(videoFile.size);

		client.sendMessage({
			channelId: DEMO_CHANNEL_ID,
			type: 'text',
			text: '',
			data: { 'fileSizeLabel': videoFileSize, 'fileNameLabel': videoFile.name, 'fileScreenShotUrl': videoUrl, fileTypeLabel: 'video' },
			file: videoFile,
		}, function (err, data) {
			if (err) {
				return alert(err);
			}
			let html = '';
			html = addFileVideohtml(data.message);
			$('.message-area').append(html);
			scrollDown();
		});
	});
}

function sendFileText() {
	$('.attach-box .attach.file').on('click', function () {
		let file = new File(["talkplus sample file..."], "Talkplus Sample.txt", { type: "text/plain" });
		let filesize = String(file.size);
		client.sendMessage({ channelId: DEMO_CHANNEL_ID,
			type: 'text',
			text: '',
			data: { 'fileSizeLabel': filesize, 'fileNameLabel': file.name, fileTypeLabel: 'text' },
			file: file,
		}, function (err, data) {
			if (err) {
				return alert(err);
			}
			let html = '';
			html = addFilehtml(data.message);
			$('.message-area').append(html);
			scrollDown();
		});
	});
}

