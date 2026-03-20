-- Fix: Infinite Recursion in profiles RLS Policies
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Problem: policies on `profiles` referenced `profiles` via subquery,
-- causing infinite recursion (error 42P17).
--
-- Solution: SECURITY DEFINER function that queries profiles bypassing RLS,
-- then use that function in all admin-check policies.

-- ============================================================
-- STEP 1: Create SECURITY DEFINER helper function
-- ============================================================
-- Runs as owner (postgres), bypasses RLS — breaks the recursion loop.

CREATE OR REPLACE FUNCTION public.auth_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- ============================================================
-- STEP 2: Fix recursive policies on profiles
-- ============================================================

DROP POLICY IF EXISTS "admins_read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admins_update_profiles" ON profiles;

CREATE POLICY "profiles_select" ON profiles FOR SELECT
  USING (auth_user_role() = 'admin' OR id = auth.uid());

CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  USING (auth_user_role() = 'admin' OR id = auth.uid());

-- ============================================================
-- STEP 3: Update policies on other tables (optional but efficient)
-- PostgreSQL can cache auth_user_role() result within a query.
-- ============================================================

-- cron_logs
DROP POLICY IF EXISTS "admins_manage_cron_logs" ON cron_logs;
CREATE POLICY "admins_manage_cron_logs" ON cron_logs FOR ALL
  USING (auth_user_role() = 'admin');

-- products
DROP POLICY IF EXISTS "admins_manage_products" ON products;
CREATE POLICY "admins_manage_products" ON products FOR ALL
  USING (auth_user_role() = 'admin')
  WITH CHECK (auth_user_role() = 'admin');

-- product_prices
DROP POLICY IF EXISTS "admins_manage_prices" ON product_prices;
DROP POLICY IF EXISTS "admins_update_prices" ON product_prices;
DROP POLICY IF EXISTS "admins_delete_prices" ON product_prices;

CREATE POLICY "admins_manage_prices" ON product_prices FOR INSERT
  WITH CHECK (auth_user_role() = 'admin');
CREATE POLICY "admins_update_prices" ON product_prices FOR UPDATE
  USING (auth_user_role() = 'admin');
CREATE POLICY "admins_delete_prices" ON product_prices FOR DELETE
  USING (auth_user_role() = 'admin');
