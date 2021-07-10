(function () {
  let ui = {
    btnEnable: document.getElementsByName('extensionEnabled')[0],
    txtDatesUrl: document.getElementsByName('datesUrl')[0],
    txtLoginUrl: document.getElementsByName('loginPageUrl')[0],
    txtToken: document.getElementsByName('token')[0],
  }

  let uiState = {
    extensionEnabled: false,
    datesUrl: '',
    loginPageUrl: '',
    token: ''
  }

  let be = {
    startListening() {
      browser.runtime.sendMessage({
        type: 'startListening'
      });
    },
    stopListening() {
      browser.runtime.sendMessage({
        type: 'stopListening'
      });
    },
    saveNewDatesUrl(newUrl) {
      browser.runtime.sendMessage({
        type: 'datesUrlUpdated',
        newDatesUrl: newUrl
      })
    },
    saveNewLoginPageUrl(newValue) {
      browser.runtime.sendMessage({
        type: 'loginPageUrlUpdated',
        newValue: newValue
      })
    },
    saveToken(newValue) {
      browser.runtime.sendMessage({
        type: 'tokenUpdated',
        newValue: newValue
      })
    }
  }

  function renderState() {
    ui.btnEnable.checked = uiState.extensionEnabled
    ui.txtDatesUrl.value = uiState.datesUrl
    ui.txtLoginUrl.value = uiState.loginPageUrl
    ui.txtToken.value = uiState.token

    ui.btnEnable.disabled = uiState.datesUrl?.length <=0 || uiState.loginPageUrl <=0 || uiState.token?.length <=0
    ui.txtDatesUrl.disabled = ui.btnEnable.checked
    ui.txtLoginUrl.disabled = ui.btnEnable.checked
    ui.txtToken.disabled = ui.btnEnable.checked
  }

  function onError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed: ${error.message}`);
  }

  function onEnableChanged(e) {
    e.target.checked
      ? be.startListening()
      : be.stopListening()

    loadRenderSettings()
  }

  function onDatesUrlChanged(e) {
    let newUrl = e.target.value
    be.saveNewDatesUrl(newUrl)
    loadRenderSettings()
  }

  function onLoginPageUrlChanged(e){
    let newValue = e.target.value
    be.saveNewLoginPageUrl(newValue)
    loadRenderSettings()
  }

  function onTokenChanged(e){
    let newValue = e.target.value
    be.saveToken(newValue)
    loadRenderSettings()
  }

  function loadRenderSettings() {
    var sendingMessage = browser.runtime.sendMessage({
      type: 'getState'
    });
    sendingMessage.then((result) => {
      if (result.type === 'settings') {
        uiState.extensionEnabled = result.value.extensionEnabled
        uiState.datesUrl = result.value.datesUrl
        uiState.loginPageUrl = result.value.loginPageUrl
        uiState.token = result.value.token
      }
      else {
        console.warn('While requesting settings from BE, FE received response:')
        console.warn(result)
      }

      renderState()
    });
  }

  // ---------------------------------------------------------

  ui.btnEnable.addEventListener('change', onEnableChanged)
  ui.txtDatesUrl.addEventListener('change', onDatesUrlChanged)
  ui.txtLoginUrl.addEventListener('change', onLoginPageUrlChanged)
  ui.txtToken.addEventListener('change', onTokenChanged)

  loadRenderSettings()
})()