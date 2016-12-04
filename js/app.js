/*
* Copyright (c) 2015 Samsung Electronics Co., Ltd.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are
* met:
*
* * Redistributions of source code must retain the above copyright
* notice, this list of conditions and the following disclaimer.
* * Redistributions in binary form must reproduce the above
* copyright notice, this list of conditions and the following disclaimer
* in the documentation and/or other materials provided with the
* distribution.
* * Neither the name of Samsung Electronics Co., Ltd. nor the names of its
* contributors may be used to endorse or promote products derived from
* this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
* A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
* OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
* LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
* DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
* THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var SAAgent,
    SASocket,
    connectionListener,
    /* 입력 메시지 */
    str = "",
    /* 메크로 메시지 */
    str2 = "",
    /* 메크로 flag */
    macro = 0,
    /* 대기시간 */
    retime1 = 0,
	retime2 = 0,
	retime3 = 0,
	retime4 = 0,
	/*이전 입력 데이터*/
	predata = -1,
	/*자판*/
	arr = [[".",",","?","!"],["a", "b", "c"],["d","e","f"],[],
	       ["g","h","i"],["j","k","l"],["m","n","o"],[],
	       ["p","q"],["r","s","t"],["u","v","w"],[],
	       [],["x","y","z"],[],[]],
    responseTxt = document.getElementById("responseTxt");

/* Make Provider application running in background */
tizen.application.getCurrentApplication().hide();

/* 화면을 항상 켜놈 */
tizen.power.request("SCREEN", "SCREEN_NORMAL");

/* 팝업창 */
function createHTML(log_string)
{
    var content = document.getElementById("toast-content");
    content.innerHTML = log_string;
    tau.openPopup("#toast");
}

/* 모션 인식 */
window.addEventListener("devicemotion", function(event){
	
	if(event.acceleration.y > 15 && macro === 1 && str2 !== ""){
		SASocket.sendData(SAAgent.channelIds[0], str2);
		
		document.getElementById("title").innerHTML = "Glouch";
		createHTML("'macro'메시지를 전송 했습니다.");
		
		str = "";
		macro = 0;
		document.getElementById("label1").innerHTML = str;
        
        
	} else {
		if(event.acceleration.y > 15 && macro === 1 && str2 === "") {
			createHTML("'macro'메시지가 비어 있습니다.");
		}
	}
},true);


connectionListener = {
    /* Remote peer agent (Consumer) requests a service (Provider) connection */
    onrequest: function (peerAgent) {

        createHTML("peerAgent: peerAgent.appName<br />" +
                    "is requsting Service conncetion...");

        /* Check connecting peer by appName*/
        if (peerAgent.appName === "HelloAccessoryConsumer") {
            SAAgent.acceptServiceConnectionRequest(peerAgent);
            createHTML("Service connection request accepted.");

        } else {
            SAAgent.rejectServiceConnectionRequest(peerAgent);
            createHTML("Service connection request rejected.");

        }
    },

    /* Connection between Provider and Consumer is established */
    onconnect: function (socket) {
        var onConnectionLost,
            dataOnReceive;

        createHTML("Service connection established");

        /* Obtaining socket */
        SASocket = socket;

        onConnectionLost = function onConnectionLost (reason) {
            createHTML("Service Connection disconnected due to following reason:<br />" + reason);
        };

        /* Inform when connection would get lost */
        SASocket.setSocketStatusListener(onConnectionLost);

        
        dataOnReceive =  function dataOnReceive (channelId, data) {
            
        	
        	var newData = Number(data) - 1;

            if (!SAAgent.channelIds[0]) {
                createHTML("Something goes wrong...NO CHANNEL ID!");
                return;
            }
            /* Calculate input value */
                        
            if(newData % 4 !== 3 && newData !== 0 && newData !== 8 && newData !== 13) {
            	
            	if(predata !== newData) {
                	
            		if(str === "") {
            			str = arr[newData][0];
            		} 
            		else {
            			str = str + arr[newData][0];
            		}
                	
            		createHTML(arr[newData][0]);
                	retime1 = 1;
                	
                	setTimeout(function () {
                        retime1 = 0;
                    }, 3000);
                	
                } 
            	else {

                	if(retime1 === 0 && retime2 === 0 && retime3 === 0) {

                		if(str === "") {
                			str = arr[newData][0];
                		} 
                		
                		else {
                			str = str + arr[newData][0];
                		}
                    	
                		createHTML(arr[newData][0]);
                    	retime1 = 1;
                    	
                    	setTimeout(function () {
                            retime1 = 0;
                        }, 3000);

                    } 
                    else if(retime1 === 1 && retime2 === 0 && retime3 === 0) {
                    	
                    	str = str.substring(0, str.length - 1) + arr[newData][1];
                    	
                    	createHTML(arr[newData][1]);
                    	retime2 = 1;
                    	
                    	setTimeout(function () {
                            retime2 = 0;
                        }, 3000);
                    } 
                    else if(retime2 === 1 && retime3 === 0) {

                    	str = str.substring(0, str.length - 1) + arr[newData][2];
                    	
                    	createHTML(arr[newData][2]);
                    	retime3 = 1;
                    	
                    	setTimeout(function () {
                            retime3 = 0;
                        }, 3000);
                    } 
                    else if(retime3 === 1) {
                    	
                    	str = str.substring(0, str.length - 1) + arr[newData][0];
                    	
                    	createHTML(arr[newData][0]);
                    	retime1 = 1;
                    	retime2 = 0;
                    	retime3 = 0;
                    	
                    	setTimeout(function () {
                            retime1 = 0;
                        }, 3000);
                    	
                    }                	
                }
            } 
            
            /* ,.?! */
            else if(newData === 0) {
            	
            	if(predata !== newData) {
                	
            		if(str === "") {
            			str = arr[newData][0];
            		} 
            		else {
            			str = str + arr[newData][0];
            		}
                	
            		createHTML(arr[newData][0]);
                	retime1 = 1;
                	
                	setTimeout(function () {
                        retime1 = 0;
                    }, 3000); 
                	
                } 
            	else {

                	if(retime1 === 0 && retime2 === 0 && retime3 === 0 && retime4 === 0) {

                		if(str === "") {
                			str = arr[newData][0];
                		} 
                		
                		else {
                			str = str + arr[newData][0];
                		}
                    	
                		createHTML(arr[newData][0]);
                    	retime1 = 1;
                    	
                    	setTimeout(function () {
                            retime1 = 0;
                        }, 3000);

                    } 
                    else if(retime1 === 1 && retime2 === 0 && retime3 === 0 && retime4 === 0) {
                    	
                    	str = str.substring(0, str.length - 1) + arr[newData][1];
                    	
                    	createHTML(arr[newData][1]);
                    	retime2 = 1;
                    	
                    	setTimeout(function () {
                            retime2 = 0;
                        }, 3000);
                    	
                    } 
                    else if(retime2 === 1 && retime3 === 0 && retime4 === 0) {

                    	str = str.substring(0, str.length - 1) + arr[newData][2];
                    	
                    	createHTML(arr[newData][2]);
                    	retime3 = 1;
                    	
                    	setTimeout(function () {
                            retime3 = 0;
                        }, 3000);
                    	
                    } 
                    else if(retime3 === 1 && retime4 === 0) {
                    	
                    	str = str.substring(0, str.length - 1) + arr[newData][3];
                    	
                    	retime4 = 1;
                    	createHTML(arr[newData][3]);
                    	setTimeout(function () {
                            retime4 = 0;
                        }, 3000);
                    	
                    } 
                    else if(retime4 === 1) {
                    	
                    	str = str.substring(0, str.length - 1) + arr[newData][0];
                    	
                    	createHTML(arr[newData][0]);
                    	retime1 = 1;
                    	retime2 = 0;
                    	retime3 = 0;
                    	retime4 = 0;
                    	
                    	setTimeout(function () {
                            retime1 = 0;
                        }, 3000);
                    	
                    }
                }
            } 
            
            /* 백스페이스 */
            else if(newData === 3) {
            	
            	str = str.substring(0, str.length - 1);
            } 
            
            /* 완료 버튼 */
            else if(newData === 7) {
            	           
            	if(macro === 1) {
            		str2 = str;
            		createHTML("'macro'메시지를 저장 했습니다.");	
            	}       	
            	else {
            		
            		SASocket.sendData(SAAgent.channelIds[0], str);
            		createHTML("메시지를 전송 했습니다.");
            	}
            	str = "";            	
            } 
            
            /* p,q */
            else if(newData === 8) {

            	if(predata !== newData) {
                	
            		if(str === "") {
            			str = arr[newData][0];
            		} 
            		else {
            			str = str + arr[newData][0];
            		}
                	
            		createHTML(arr[newData][0]);
                	retime1 = 1;
                	
                	setTimeout(function () {
                        retime1 = 0;
                    }, 3000);
                	
                } 
            	else {

                	if(retime1 === 0 && retime2 === 0) {

                		if(str === "") {
                			str = arr[newData][0];
                		} 
                		
                		else {
                			str = str + arr[newData][0];
                		}
                    	
                		createHTML(arr[newData][0]);
                    	retime1 = 1;
                    	
                    	setTimeout(function () {
                            retime1 = 0;
                        }, 3000);

                    } 
                    else if(retime1 === 1 && retime2 === 0) {
                    	
                    	str = str.substring(0, str.length - 1) + arr[newData][1];
                    	
                    	createHTML(arr[newData][1]);
                    	retime2 = 1;
                    	
                    	setTimeout(function () {
                            retime2 = 0;
                        }, 3000);
                    } 
                    else if(retime2 === 1) {

                    	str = str.substring(0, str.length - 1) + arr[newData][2];
                    	
                    	createHTML(arr[newData][2]);
                    	retime1 = 1;
                    	retime2 = 0;
                    	
                    	setTimeout(function () {
                            retime1 = 0;
                        }, 3000);
                    } 
                                    	
                }
            	
            } 
            /* 메크로 버튼 */
            else if(newData === 11) {	
            	if(macro === 0) {
            		macro = 1;
            		document.getElementById("title").innerHTML = "Glouch(Macro)";      		
            	} 
            	else {
            		macro = 0;
            		document.getElementById("title").innerHTML = "Glouch";
            	}
            	str = "";
            }
            /* 스페이스바 */
            else {
            	
            	str = str + " ";
            }
            	
            	
            predata = newData;
            
            /* 입력창에 입력 */
            var output = document.getElementById("label1");
            output.innerHTML = str;
            
        };

        /* Set listener for incoming data from Consumer */
        SASocket.setDataReceiveListener(dataOnReceive);
    },
    onerror: function (errorCode) {
        createHTML("Service connection error<br />errorCode: " + errorCode);
    }
};


function requestOnSuccess (agents) {
    var i = 0;

    for (i; i < agents.length; i += 1) {
        if (agents[i].role === "PROVIDER") {
            createHTML("Service Provider found!<br />" +
                        "Name: " +  agents[i].name);
            SAAgent = agents[i];
            break;
        }
    }

    /* Set listener for upcoming connection from Consumer */
    SAAgent.setServiceConnectionListener(connectionListener);
};

function requestOnError (e) {
    createHTML("requestSAAgent Error" +
                "Error name : " + e.name + "<br />" +
                "Error message : " + e.message);
};

/* Requests the SAAgent specified in the Accessory Service Profile */
webapis.sa.requestSAAgent(requestOnSuccess, requestOnError);


(function () {
    /* Basic Gear gesture & buttons handler */
    window.addEventListener('tizenhwkey', function(ev) {
        var page,
            pageid;

        if (ev.keyName === "back") {
            page = document.getElementsByClassName('ui-page-active')[0];
            pageid = page ? page.id : "";
            if (pageid === "main") {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    });
}());

(function(tau) {
    var toastPopup = document.getElementById('toast');

    toastPopup.addEventListener('popupshow', function(ev){
        setTimeout(function () {
            tau.closePopup();
        }, 3000);
    }, false);
})(window.tau);