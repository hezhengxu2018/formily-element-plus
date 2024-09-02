<script lang="ts" setup>
import type { DataField } from '@formily/core'
import { createForm, onFieldReact } from '@formily/core'
import { Field } from '@formily/vue'
import { Cascader, Form, FormItem, Submit } from '@sliver/formily-element-plus'
import { action } from '@formily/reactive'

type IAddress = { name: string, code: string, cities: number, districts: number } | string

function transformAddress(data = {}) {
  return Object.entries(data).reduce(
    (
      buf,
      [key, value]: [string, IAddress],
    ) => {
      if (typeof value === 'string')
        return buf.concat({ label: value, value: key })
      const { name, code, cities, districts } = value as any
      const _cities = transformAddress(cities)
      const _districts = transformAddress(districts)
      return buf.concat({
        label: name,
        value: code,
        children: _cities.length
          ? _cities
          : _districts.length
            ? _districts
            : undefined,
      })
    },
    [],
  )
}

function useAddress(pattern) {
  onFieldReact(pattern, (field: DataField) => {
    field.loading = true
    fetch('//unpkg.com/china-location/dist/location.json')
      .then(res => res.json())
      .then(
        action.bound((data) => {
          field.dataSource = transformAddress(data)
          field.loading = false
        }),
      )
  })
}

const form = createForm({
  effects: () => {
    useAddress('address')
  },
})

function onSubmit(value) {
  console.log(value)
}
</script>

<template>
  <Form :form="form">
    <Field
      name="address"
      title="地址选择"
      required
      :decorator="[FormItem]"
      :component="[
        Cascader,
        {
          style: {
            width: '240px',
          },
        },
      ]"
    />

    <Submit @submit="onSubmit">
      提交
    </Submit>
  </Form>
</template>
