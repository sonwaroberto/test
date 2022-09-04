import React, {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'

interface data {
  key: string
  id: string
  localizations: {
    EN: {
      value: string
    }
    FR: {
      value: string
    }
  }
}
interface IThemeContext {
  datas?: data[]
  setValue: (items: data[]) => void
  findElementByKey: (key: string) => string | null
  currentLanguage: string
  setLanguage: () => void
}

export const datasContext = createContext<IThemeContext>({
  setValue: () => null,
  datas: [],
  findElementByKey: (key: string) => '',
  currentLanguage: 'EN',
  setLanguage: () => null,
})

export const DatasContextProvider: FC<{ children: ReactElement }> = ({
  children,
}: {
  children: ReactElement
}) => {
  const [datas, setDatas] = useState<Array<data>>([])
  const [currentLanguage, UpdateLanguage] = useState<string>(
    localStorage.getItem('defaultLanguage') ||
      navigator.language.slice(0, 2).toUpperCase()
  )
  useEffect(() => {
    let defaultLanguage = localStorage.getItem('defaultLanguage')
    if (!defaultLanguage) {
      const navigatorLanguage =  navigator.language.slice(0, 2).toUpperCase()
      localStorage.setItem('defaultLanguage', navigatorLanguage)
      defaultLanguage = navigatorLanguage
    }
    UpdateLanguage(defaultLanguage)
  }, [])
  const setValue = (items: data[]) => {
    setDatas(items)
  }
  const setLanguage = () => {
    if (currentLanguage === 'EN') {
      UpdateLanguage('FR')
      localStorage.setItem('defaultLanguage', 'FR')
    } else {
      UpdateLanguage('EN')
      localStorage.setItem('defaultLanguage', 'EN')
    }
  }
  const findElementByKey = (key: string) => {
    const value = datas.find((item: data) => {
      return item.key === key
    })
    if (!value) return null
    if (currentLanguage === 'FR') {
      return value?.localizations['FR'].value
    } else {
      return value?.localizations['EN'].value
    }
  }

  return (
    <datasContext.Provider
      value={{
        datas,
        setValue,
        currentLanguage,
        setLanguage,
        findElementByKey,
      }}
    >
      <>{children}</>
    </datasContext.Provider>
  )
}

export const useThemeContext = () => useContext(datasContext)
