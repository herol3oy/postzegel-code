import { useEffect, useState } from 'react'
import { format, isAfter } from 'date-fns'

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
const INITIAL_CODE_ARRAY = Array(9).fill('')
const CODE_EXPIRATION_TIME = 1 * 60 * 1000

type GeneratedCode = {
  code: string
  redeemed: boolean
  createdAt: Date
}

export default function App() {
  const [currentCode, currentCodeSet] = useState<string[]>(INITIAL_CODE_ARRAY)
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
    generatedCodesSet([...generatedCodes, { code, redeemed: false, createdAt: new Date() }])

    errMsgSet(null)
    successMsgSet(null)
  }

  const redeemCode = () => {
    const codeToRedeem = redeemInput.trim()
    const updatedCodes = generatedCodes.map((generatedCode) => {
      if (generatedCode.code === codeToRedeem) {
        if (
          isAfter(new Date(), new Date(generatedCode.createdAt.getTime() + CODE_EXPIRATION_TIME))
        ) {
          errMsgSet('Code has expired and cannot be redeemed!')
          return { ...generatedCode, redeemed: true }
        }
        return { ...generatedCode, redeemed: true }
      }
      return generatedCode
    })

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

  useEffect(() => {
    const interval = setInterval(() => {
      generatedCodesSet((prevCodes) => {
        return prevCodes.map((item) => {
          if (item.redeemed) {
            return item
          }
          const isExpired = isAfter(
            new Date(),
            new Date(item.createdAt.getTime() + CODE_EXPIRATION_TIME),
          )
          return { ...item, redeemed: isExpired ? true : item.redeemed }
        })
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [generatedCodes])

  return (
    <div className="min-h-screen p-6 font-mono bg-black">
      <div className="w-full max-w-4xl p-8 mx-auto border-4 border-yellow-500 rounded-lg shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600">
        <h1 className="mb-6 text-4xl font-bold text-center text-yellow-300 pixel-font">
          Postzegelcode Generator
        </h1>

        <p className="mb-6 leading-relaxed text-center text-yellow-200">
          A postzegelcode is a hand-written method of franking in the Netherlands.
        </p>

        <p className="mb-6 text-center text-yellow-200">
          <a
            href="https://en.wikipedia.org/wiki/Postzegelcode"
            target="_blank"
            className="text-yellow-400 underline hover:text-yellow-300"
          >
            Wikipedia
          </a>
          {` | `}
          <a
            href="https://postnl.nl/versturen/postzegels/postzegels-kopen/postzegelcode"
            target="_blank"
            className="text-yellow-400 underline hover:text-yellow-300"
          >
            PostNl
          </a>
          {` | `}
          <a
            href="https://github.com/herol3oy/postzegel-code"
            target="_blank"
            className="text-yellow-400 underline hover:text-yellow-300"
          >
            Github
          </a>
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="p-6 border-4 border-yellow-500 rounded-lg shadow-inner bg-gradient-to-b from-gray-700 to-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-yellow-400">Current Code</h2>
            <div className="grid grid-cols-3 gap-4 text-4xl font-bold text-center">
              {currentCode.map((char, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-full h-24 text-yellow-300 transition duration-300 ease-in-out transform border-2 border-yellow-500 rounded-md bg-gradient-to-t from-gray-600 to-gray-500 hover:scale-105 pixel-box"
                >
                  {char}
                </div>
              ))}
            </div>
            <button
              onClick={generateCode}
              className="w-full px-4 py-2 mt-6 text-black rounded bg-gradient-to-r from-yellow-600 to-yellow-500 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Generate New Code
            </button>
          </div>

          <div className="p-6 border-4 border-yellow-500 rounded-lg shadow-inner bg-gradient-to-b from-gray-700 to-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-yellow-400">Redeem Code</h2>
            <input
              type="text"
              value={redeemInput}
              onChange={(e) => redeemInputSet(e.target.value)}
              placeholder="Enter your code"
              className="w-full px-4 py-2 mb-2 text-yellow-200 bg-gray-600 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={redeemCode}
              className="w-full px-4 py-2 text-black rounded bg-gradient-to-r from-yellow-600 to-yellow-500 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Redeem
            </button>
            {errMsg && <p className="mt-4 text-red-400">{errMsg}</p>}
            {successMsg && <p className="mt-4 text-green-400">{successMsg}</p>}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-yellow-400">Generated Codes:</h2>
          <table className="min-w-full bg-gray-800 border border-yellow-500">
            <thead>
              <tr className="text-yellow-300 bg-gray-700">
                <th className="px-4 py-2 text-left border-b border-yellow-500">Code</th>
                <th className="px-4 py-2 text-left border-b border-yellow-500">Status</th>
                <th className="px-4 py-2 text-left border-b border-yellow-500">Created At</th>
                <th className="px-4 py-2 text-left border-b border-yellow-500">Countdown</th>
                <th className="px-4 py-2 text-left border-b border-yellow-500">Action</th>
              </tr>
            </thead>
            <tbody className="text-yellow-200">
              {[...generatedCodes].reverse().map((item, index) => {
                const isExpired = isAfter(
                  new Date(),
                  new Date(item.createdAt.getTime() + CODE_EXPIRATION_TIME),
                )
                const remainingTime = Math.max(
                  0,
                  (item.createdAt.getTime() + CODE_EXPIRATION_TIME - new Date().getTime()) / 1000,
                )
                const minutes = Math.floor(remainingTime / 60)
                const seconds = Math.floor(remainingTime % 60)

                return (
                  <tr
                    key={index}
                    className={`hover:bg-gray-700 ${item.redeemed || isExpired ? 'line-through text-gray-600' : ''}`}
                  >
                    <td className="px-4 py-2 border-b border-yellow-500">{item.code}</td>
                    <td className="px-4 py-2 border-b border-yellow-500">
                      {item.redeemed ? 'Redeemed' : isExpired ? 'Expired' : 'Available'}
                    </td>
                    <td className="px-4 py-2 border-b border-yellow-500">
                      {format(item.createdAt, 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-4 py-2 border-b border-yellow-500">
                      {item.redeemed || isExpired
                        ? '00:00'
                        : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
                    </td>
                    <td className="px-4 py-2 border-b border-yellow-500">
                      <button
                        onClick={() => copyToClipboard(item.code)}
                        className="px-3 py-1 text-yellow-300 bg-gray-600 border border-yellow-400 rounded hover:bg-gray-500"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
