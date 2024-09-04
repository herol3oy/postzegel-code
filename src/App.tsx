import { useState } from 'react'

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
const CURRENT_CODE_INIT = Array(9).fill('')

type GeneratedCode = {
  code: string
  redeemed: boolean
}

export default function App() {
  const [currentCode, currentCodeSet] = useState<string[]>(CURRENT_CODE_INIT)
  const [generatedCodes, generatedCodesSet] = useState<GeneratedCode[]>([])
  const [redeemInput, redeemInputSet] = useState<string>('')
  const [errMsg, errMsgSet] = useState<string | null>(null)
  const [successMsg, successMsgSet] = useState<string | null>(null)

  const generateCode = () => {
    let code = ''

    for (let i = 0; i < 9; i++) {
      const randomChar = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
      code += randomChar
    }

    currentCodeSet(code.split(''))
    generatedCodesSet([...generatedCodes, { code, redeemed: false }])

    errMsgSet(null)
    successMsgSet(null)
  }

  const redeemCode = () => {
    const codeToRedeem = redeemInput.trim()
    const updatedCodes = generatedCodes.map((generatedCode) =>
      generatedCode.code === codeToRedeem ? { ...generatedCode, redeemed: true } : generatedCode,
    )

    if (updatedCodes.some((item) => item.code === codeToRedeem && item.redeemed)) {
      generatedCodesSet(updatedCodes)
      successMsgSet('Code successfully redeemed!')
      errMsgSet(null)
    } else {
      errMsgSet('Code not found or already redeemed!')
      successMsgSet(null)
    }

    redeemInputSet('')
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="bg-gray-900 p-6 min-h-screen font-mono">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-500">
          Postzegelcode Generator
        </h1>

        <p className="text-gray-400 text-center mb-6 leading-relaxed">
          A postzegelcode is a hand-written method of franking in the Netherlands.
        </p>

        <p className="text-gray-400 text-center mb-6">
          <a
            href="https://en.wikipedia.org/wiki/Postzegelcode"
            target="_blank"
            className="text-purple-300 hover:text-purple-200 underline"
          >
            Wikipedia
          </a>
          {` | `}
          <a
            href="https://postnl.nl/versturen/postzegels/postzegels-kopen/postzegelcode"
            target="_blank"
            className="text-purple-300 hover:text-purple-200 underline"
          >
            PostNl
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Current Code</h2>
            <div className="grid grid-cols-3 gap-4 text-2xl font-bold text-center">
              {currentCode.map((char, index) => (
                <div
                  key={index}
                  className="bg-gray-600 text-purple-300 border-2 border-purple-500 flex items-center justify-center w-full h-24 rounded-md transform transition duration-300 ease-in-out hover:scale-105"
                >
                  {char}
                </div>
              ))}
            </div>
            <button
              onClick={generateCode}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded mt-6 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Generate New Code
            </button>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Redeem Code</h2>
            <input
              type="text"
              value={redeemInput}
              onChange={(e) => redeemInputSet(e.target.value)}
              placeholder="Enter your code"
              className="w-full bg-gray-600 border border-purple-400 text-gray-300 rounded py-2 px-4 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={redeemCode}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Redeem
            </button>
            {errMsg && <p className="text-red-400 mt-4">{errMsg}</p>}
            {successMsg && <p className="text-green-400 mt-4">{successMsg}</p>}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-purple-400">Generated Codes:</h2>
          <ul className="list-disc list-inside text-gray-300">
            {[...generatedCodes].reverse().map((item, index) => (
              <li
                key={index}
                className={`flex items-center justify-between ${item.redeemed ? 'line-through text-gray-600' : ''}`}
              >
                <span>{item.code}</span>
                <button
                  onClick={() => copyToClipboard(item.code)}
                  className="bg-gray-600 text-purple-300 py-1 px-3 my-1 rounded hover:bg-gray-500 border border-purple-400"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
