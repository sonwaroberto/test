interface oldAssetInterface {
  key: string
  id: string
  value: {
    data: {
      value: string
    }
  }
  localizations: {
    data: [
      {
        attributes: {
          value: string
        }
      }
    ]
  }
}
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

export default function formatData(assets: []) {
  const array: data[] = []
  assets.map((asset: oldAssetInterface) => {
    array.push({
      id: asset.id,
      key: asset.key,
      localizations: {
        FR: { value: asset.value.data.value },
        EN: { value: asset.localizations.data[0].attributes.value },
      },
    })
  })
  return array
}
