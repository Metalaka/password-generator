function $ (id) {
  return document.getElementById(id)
}

// https://github.com/chancejs/chancejs/issues/232#issuecomment-182500222
function getRandomIntInclusive (min, max) {
  const randomBuffer = new Uint32Array(1)

  window.crypto.getRandomValues(randomBuffer)

  const randomNumber = randomBuffer[0] / (0xffffffff + 1)

  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(randomNumber * (max - min + 1)) + min
}

// Generator
const groups = {
  lower: "abcdefghjkmnpqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  numbers: "23456789",
  symbols: "!#$%&*+-=?@^_",
  ambiguous: "{}[]()\/'\"`~,;:.<>\\",
  similar: {
    lower: "ilo",
    upper: "IO",
    numbers: "01",
    symbols: "|",
  },
}

function buildOptions (configuration) {
  let options = ""

  if (configuration.lower) {
    options += groups.lower

    if (configuration.similar) {
      options += groups.similar.lower
    }
  }
  if (configuration.upper) {
    options += groups.upper

    if (configuration.similar) {
      options += groups.similar.upper
    }
  }
  if (configuration.numbers) {
    options += groups.numbers

    if (configuration.similar) {
      options += groups.similar.numbers
    }
  }
  if (configuration.symbols) {
    options += groups.symbols

    if (configuration.similar) {
      options += groups.similar.symbols
    }
  }
  if (configuration.ambiguous) {
    options += groups.ambiguous
  }

  return options
}

function generatePassword (configuration) {

  const options = buildOptions(configuration)

  if (options === "") {
    return "You must select at least one character set!"
  }

  const optionsLength = options.length
  let result = ""

  for (let i = 0; i < configuration.length; i++) {
    const position = getRandomIntInclusive(0, optionsLength - 1)
    result += options.substring(position, position + 1)
  }

  return result
}

function getConfiguration () {
  return {
    length: parseInt($("length").value),
    lower: $("lowercase").checked | false,
    upper: $("uppercase").checked | false,
    numbers: $("numbers").checked | false,
    symbols: $("symbols").checked | false,
    similar: $("similar").checked | false,
    ambiguous: $("ambiguous").checked | false,
  }
}

// Initialize events
(function () {
  $("length").value = 16

  $('generate-password').addEventListener("click", (e) => {
    e.preventDefault()

    const password = generatePassword(getConfiguration())
    $("password").value = password
  })

  $('copy').addEventListener("click", (e) => {
    e.preventDefault()

    const password = $("password")

    password.select()

    document.execCommand("copy")
  })

  $('password').addEventListener("click", (e) => {
    e.preventDefault()

    const password = $("password")

    password.focus()
    password.select()
  })
})()
