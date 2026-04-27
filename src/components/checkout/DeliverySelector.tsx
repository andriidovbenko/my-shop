"use client"
import { useState, useEffect, useRef } from "react"
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Stack,
  Select,
  Text,
  Spinner,
} from "@chakra-ui/react"
import type { NPCity, NPWarehouse, DeliveryType, DeliveryCarrier, UkrposhtaMethod } from "@/types"

export interface DeliveryValue {
  carrier: DeliveryCarrier
  city: string
  // Nova Poshta
  cityRef: string
  deliveryType: DeliveryType
  warehouseRef: string
  warehouseDescription: string
  // Ukrposhta
  deliveryMethod: UkrposhtaMethod
  postIndex: string
  streetAddress: string
}

interface Props {
  value: DeliveryValue
  onChange: (value: DeliveryValue) => void
  errors?: Partial<Record<keyof DeliveryValue, string>>
}

export function DeliverySelector({ value, onChange, errors }: Props) {
  const [cityQuery, setCityQuery] = useState(value.carrier === "novaposhta" ? value.city : "")
  const [citySuggestions, setCitySuggestions] = useState<NPCity[]>([])
  const [cityLoading, setCityLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([])
  const [warehousesLoading, setWarehousesLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounced NP city search
  useEffect(() => {
    if (value.carrier !== "novaposhta") return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (cityQuery.trim().length < 2) { setCitySuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      setCityLoading(true)
      try {
        const res = await fetch(`/api/np/cities?q=${encodeURIComponent(cityQuery)}`)
        const data = await res.json()
        setCitySuggestions(Array.isArray(data) ? data : [])
        setShowSuggestions(true)
      } catch { setCitySuggestions([]) }
      finally { setCityLoading(false) }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [cityQuery, value.carrier])

  // Load NP warehouses/postomats
  useEffect(() => {
    if (value.carrier !== "novaposhta" || !value.cityRef) { setWarehouses([]); return }
    const endpoint = value.deliveryType === "postomat" ? "/api/np/postomats" : "/api/np/warehouses"
    setWarehousesLoading(true)
    fetch(`${endpoint}?ref=${encodeURIComponent(value.cityRef)}`)
      .then((r) => r.json())
      .then((data) => setWarehouses(Array.isArray(data) ? data : []))
      .catch(() => setWarehouses([]))
      .finally(() => setWarehousesLoading(false))
  }, [value.cityRef, value.deliveryType, value.carrier])

  // Close dropdown on outside click
  useEffect(() => {
    function h(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const handleCarrierChange = (carrier: string) => {
    setCityQuery("")
    setCitySuggestions([])
    setWarehouses([])
    onChange({
      ...value,
      carrier: carrier as DeliveryCarrier,
      city: "", cityRef: "", warehouseRef: "", warehouseDescription: "",
      postIndex: "", streetAddress: "",
    })
  }

  const selectCity = (city: NPCity) => {
    setCityQuery(city.cityName)
    setShowSuggestions(false)
    setCitySuggestions([])
    onChange({ ...value, city: city.cityName, cityRef: city.ref, warehouseRef: "", warehouseDescription: "" })
  }

  const handleNpDeliveryTypeChange = (type: string) => {
    onChange({ ...value, deliveryType: type as DeliveryType, warehouseRef: "", warehouseDescription: "", streetAddress: "" })
  }

  const handleWarehouseChange = (ref: string) => {
    const w = warehouses.find((w) => w.ref === ref)
    onChange({ ...value, warehouseRef: ref, warehouseDescription: w?.description ?? "" })
  }

  const handleUpDeliveryMethodChange = (method: string) => {
    onChange({ ...value, deliveryMethod: method as UkrposhtaMethod, streetAddress: "" })
  }

  return (
    <Box>
      {/* Carrier selector */}
      <FormControl mb={5}>
        <FormLabel color="text.default">Служба доставки</FormLabel>
        <RadioGroup value={value.carrier} onChange={handleCarrierChange}>
          <Stack direction="row" gap={6}>
            <Radio value="novaposhta" borderColor="border.default">
              <Text color="text.default">Нова Пошта</Text>
            </Radio>
            <Radio value="ukrposhta" borderColor="border.default">
              <Text color="text.default">Укрпошта</Text>
            </Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* ── Nova Poshta ── */}
      {value.carrier === "novaposhta" && (
        <>
          <FormControl mb={4} isInvalid={!!errors?.city}>
            <FormLabel color="text.default">Місто</FormLabel>
            <Box position="relative" ref={wrapperRef}>
              <Input
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value)
                  if (!e.target.value) onChange({ ...value, city: "", cityRef: "", warehouseRef: "", warehouseDescription: "" })
                }}
                onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Введіть назву міста..."
                borderColor={errors?.city ? "red.500" : "border.default"}
                _focus={{ borderColor: "accent.default", boxShadow: "none" }}
              />
              {cityLoading && (
                <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
                  <Spinner size="sm" color="accent.default" />
                </Box>
              )}
              {showSuggestions && citySuggestions.length > 0 && (
                <Box position="absolute" top="100%" left={0} right={0} zIndex={10} bg="white"
                  borderWidth="1px" borderColor="border.default" borderRadius="md" shadow="md" maxH="200px" overflowY="auto">
                  {citySuggestions.map((city) => (
                    <Box key={city.ref} px={3} py={2} cursor="pointer" _hover={{ bg: "bg.card" }}
                      onMouseDown={() => selectCity(city)} fontSize="sm">
                      {city.cityName}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            {errors?.city && <Text color="red.500" fontSize="sm" mt={1}>{errors.city}</Text>}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="text.default">Спосіб отримання</FormLabel>
            <RadioGroup value={value.deliveryType} onChange={handleNpDeliveryTypeChange}>
              <Stack direction="row" gap={4}>
                <Radio value="warehouse" borderColor="border.default"><Text color="text.default">Відділення</Text></Radio>
                <Radio value="postomat" borderColor="border.default"><Text color="text.default">Поштомат</Text></Radio>
                <Radio value="courier" borderColor="border.default"><Text color="text.default">{"Кур'єр"}</Text></Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {value.cityRef && value.deliveryType !== "courier" && (
            <FormControl isInvalid={!!errors?.warehouseRef}>
              <FormLabel color="text.default">{value.deliveryType === "postomat" ? "Поштомат" : "Відділення"}</FormLabel>
              {warehousesLoading ? (
                <Box display="flex" alignItems="center" gap={2} py={2}>
                  <Spinner size="sm" color="accent.default" />
                  <Text fontSize="sm" color="text.muted">Завантаження...</Text>
                </Box>
              ) : warehouses.length === 0 ? (
                <Text fontSize="sm" color="text.muted">
                  {value.deliveryType === "postomat" ? "Поштоматів не знайдено" : "Відділень не знайдено"}
                </Text>
              ) : (
                <Select value={value.warehouseRef} onChange={(e) => handleWarehouseChange(e.target.value)}
                  placeholder="Оберіть відділення..."
                  borderColor={errors?.warehouseRef ? "red.500" : "border.default"}
                  _focus={{ borderColor: "accent.default", boxShadow: "none" }}>
                  {warehouses.map((w) => (
                    <option key={w.ref} value={w.ref}>{w.description}</option>
                  ))}
                </Select>
              )}
              {errors?.warehouseRef && <Text color="red.500" fontSize="sm" mt={1}>{errors.warehouseRef}</Text>}
            </FormControl>
          )}

          {value.cityRef && value.deliveryType === "courier" && (
            <FormControl isInvalid={!!errors?.streetAddress}>
              <FormLabel color="text.default">Адреса доставки</FormLabel>
              <Input
                value={value.streetAddress}
                onChange={(e) => onChange({ ...value, streetAddress: e.target.value })}
                placeholder="вул. Хрещатик, 1, кв. 10"
                borderColor={errors?.streetAddress ? "red.500" : "border.default"}
                _focus={{ borderColor: "accent.default", boxShadow: "none" }}
              />
              {errors?.streetAddress && <Text color="red.500" fontSize="sm" mt={1}>{errors.streetAddress}</Text>}
            </FormControl>
          )}
        </>
      )}

      {/* ── Укрпошта ── */}
      {value.carrier === "ukrposhta" && (
        <>
          <FormControl mb={4} isInvalid={!!errors?.city}>
            <FormLabel color="text.default">Місто / Населений пункт</FormLabel>
            <Input
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              placeholder="Київ"
              borderColor={errors?.city ? "red.500" : "border.default"}
              _focus={{ borderColor: "accent.default", boxShadow: "none" }}
            />
            {errors?.city && <Text color="red.500" fontSize="sm" mt={1}>{errors.city}</Text>}
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors?.postIndex}>
            <FormLabel color="text.default">Поштовий індекс</FormLabel>
            <Input
              value={value.postIndex}
              onChange={(e) => onChange({ ...value, postIndex: e.target.value.replace(/\D/g, "").slice(0, 5) })}
              placeholder="01001"
              maxLength={5}
              borderColor={errors?.postIndex ? "red.500" : "border.default"}
              _focus={{ borderColor: "accent.default", boxShadow: "none" }}
            />
            {errors?.postIndex && <Text color="red.500" fontSize="sm" mt={1}>{errors.postIndex}</Text>}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="text.default">Спосіб отримання</FormLabel>
            <RadioGroup value={value.deliveryMethod} onChange={handleUpDeliveryMethodChange}>
              <Stack direction="row" gap={4}>
                <Radio value="post_office" borderColor="border.default"><Text color="text.default">Відділення</Text></Radio>
                <Radio value="courier" borderColor="border.default"><Text color="text.default">{"Кур'єр (додому)"}</Text></Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {value.deliveryMethod === "courier" && (
            <FormControl isInvalid={!!errors?.streetAddress}>
              <FormLabel color="text.default">Адреса доставки</FormLabel>
              <Input
                value={value.streetAddress}
                onChange={(e) => onChange({ ...value, streetAddress: e.target.value })}
                placeholder="вул. Хрещатик, 1, кв. 10"
                borderColor={errors?.streetAddress ? "red.500" : "border.default"}
                _focus={{ borderColor: "accent.default", boxShadow: "none" }}
              />
              {errors?.streetAddress && <Text color="red.500" fontSize="sm" mt={1}>{errors.streetAddress}</Text>}
            </FormControl>
          )}
        </>
      )}
    </Box>
  )
}
