import { supabase } from '../supabaseClient'

export async function getAll() {
  const { data, error } = await supabase.from('Test').select('*')
  if (error) throw error
  return data
}

export async function getById(id) {
  const { data, error } = await supabase.from('Test').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function create(name) {
  const { data, error } = await supabase.from('Test').insert({ Name: name }).select().single()
  if (error) throw error
  return data
}

export async function update(id, name) {
  const { data, error } = await supabase.from('Test').update({ Name: name }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function remove(id) {
  const { error } = await supabase.from('Test').delete().eq('id', id)
  if (error) throw error
}
