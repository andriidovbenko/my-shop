import type { NPCity, NPWarehouse } from "@/types"

const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/"

type NPRawAddress = { Ref: string; Present: string; Area: string; SettlementTypeCode: string }
type NPRawWarehouse = { Ref: string; Description: string; ShortAddress: string }

async function npRequest(body: object): Promise<unknown> {
  const res = await fetch(NP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: process.env.NOVA_POSHTA_API_KEY,
      ...body,
    }),
  })
  if (!res.ok) throw new Error(`Nova Poshta API error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function searchCities(query: string): Promise<NPCity[]> {
  const data = (await npRequest({
    modelName: "Address",
    calledMethod: "searchSettlements",
    methodProperties: { CityName: query, Limit: "10" },
  })) as Array<{ Addresses: NPRawAddress[] }> | null
  const addresses = data?.[0]?.Addresses ?? []
  return addresses.map((a) => ({
    ref: a.Ref,
    cityName: a.Present,
    area: a.Area,
    settlementType: a.SettlementTypeCode,
  }))
}

export async function getWarehouses(cityRef: string): Promise<NPWarehouse[]> {
  const data = (await npRequest({
    modelName: "AddressGeneral",
    calledMethod: "getWarehouses",
    methodProperties: {
      SettlementRef: cityRef,
      TypeOfWarehouseRef: "841339c7-591a-42e2-8233-7a0a00f0ed6f",
    },
  })) as NPRawWarehouse[] | null
  return (data ?? []).map((w) => ({
    ref: w.Ref,
    description: w.Description,
    address: w.ShortAddress,
  }))
}

export async function getPostomats(cityRef: string): Promise<NPWarehouse[]> {
  const data = (await npRequest({
    modelName: "AddressGeneral",
    calledMethod: "getWarehouses",
    methodProperties: {
      SettlementRef: cityRef,
      TypeOfWarehouseRef: "f9316480-5f2d-425d-bc2c-ac7cd29decf0",
    },
  })) as NPRawWarehouse[] | null
  return (data ?? []).map((w) => ({
    ref: w.Ref,
    description: w.Description,
    address: w.ShortAddress,
  }))
}
