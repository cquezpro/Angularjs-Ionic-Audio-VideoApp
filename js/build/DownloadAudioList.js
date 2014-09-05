/**
 * 	DownloadAudioList.js
 * 	DownloadAudioList PhoneGap plugin (Android)
 *
 * 	Created by ApliteinfoSolution on 29/10/2013.
 * 	Copyright 2013 ApliteinfoSolution. All rights reserved.
 *
 *
 * Update by Matt McGrath to work with Cordova version of PhoneGap 1.6 upwards - 01/06/2012
 *
 */
var DownloadAudioList = { 
    setFlagForCheckValue:0,
    downloadfilePath:"",
    downloadfileName:"",
    downloadParcent:0,
    checkDownlaodAudioFileExist:function(successCallback, failureCallback,Url,setfileName) {
      var fileName = Url.substring(Url.lastIndexOf('/') + 1);
	  DownloadAudioList.downloadfilePath = Url;
// 	  DownloadAudioList.getDownlaodAudioFile(successCallback,failureCallback,fileName);
	},
	
	startDownlaodAudioFile: function(successCallback, failureCallback,downloadFileUrl) {
	 debugger;
	     var getFileName = downloadFileUrl.substring(downloadFileUrl.lastIndexOf('/') + 1);
		return cordova.exec(successCallback,
                            failureCallback,
                            'DownloadAudioList',//plugin name
                            'downlaodAudioFileSaveOnDevice',//plugin method name
                            [downloadFileUrl,getFileName]); // no arguments required
	},
	
	getDownlaodAudioFile: function(successCallback, failureCallback,fileName) {
	   return cordova.exec(successCallback,
			failureCallback,
			'DownloadAudioList',
			'getDownlaodAudioFileFromDevice',
			[fileName]); // no arguments required
	},
	
    deleteAudioFile: function(successCallback, failureCallback,deleteFileUrl) {
     debugger;
     var fileName = deleteFileUrl.substring(deleteFileUrl.lastIndexOf('/') + 1);
        return cordova.exec(function(value){
        successCallback(value);
      scope = angular.element(document.getElementById("downloadcountdiv")).scope();
      if(scope)
      {
        scope.audioPlayer.downloadBtnLable = 2; 
        scope.$apply(function(){
        })
      }
        },
                        failureCallback,
                        'DownloadAudioList',//plugin name
                        'deleteAudioFromDevice',//plugin method name
                        [fileName]); // no arguments required
    },
    
    getAudioFileLocalUrl: function(successCallback, failureCallback,downloadFileUrl) {
      debugger;
      DownloadAudioList.downloadfileName = downloadFileUrl.substring(downloadFileUrl.lastIndexOf('/') + 1);;
      DownloadAudioList.downloadfilePath = downloadFileUrl;
        return cordova.exec(successCallback,
                        failureCallback,
                        'DownloadAudioList',//plugin name
                        'playAudioFromDevice',//plugin method name
                        [DownloadAudioList.downloadfileName]);
      },
      
    getCheckDownlaodAudioFileExist:function(successCallback, failureCallback,Url) {
        debugger;
	 var fileName = Url.substring(Url.lastIndexOf('/') + 1);
	   DownloadAudioList.getDownlaodAudioFile(successCallback,failureCallback,fileName);
	},  
	startCheckDownlaod:function(successCallback, failureCallback) {
	    debugger;
	   return cordova.exec(successCallback,
                        failureCallback,
                        'DownloadAudioList',//plugin name
                        'downloadingCount',//plugin method name
                        [""]);
	},
	getCountDown:function(value)
	{
	  scope = angular.element(document.getElementById("downloadcountdiv")).scope();
      if(scope)
      {
        scope.audioPlayer.downloadBtnLable = 3; 
        scope.audioPlayer.progressbarhide =  true;
        scope.$apply(function(){
         scope.downloadCount  = value;
      })
      }
   },
	
   downloadingDone:function()
	{
	  scope = angular.element(document.getElementById("downloadcountdiv")).scope();
      if(scope)
      {
       scope.audioPlayer.downloadBtnLable = 1; 
       scope.audioPlayer.progressbarhide =  false;
       scope.$apply(function(){
     
      })
      }
   }
	
};

