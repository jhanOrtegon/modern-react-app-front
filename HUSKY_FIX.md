# 🔧 Solución al Problema de Husky

## ❌ Problema

Husky no se ejecutaba al hacer commits porque **no estaba correctamente inicializado**.

## 🔍 Diagnóstico

Los problemas encontrados fueron:

1. **Husky no inicializado**: El comando `git config core.hooksPath` no apuntaba a `.husky/_`
2. **Hooks no instalados**: La carpeta `.husky/_/` no existía
3. **Sintaxis incorrecta**: Los hooks usaban sintaxis de Husky v8 (antigua) en lugar de v9
4. **Package manager incorrecto**: Usaban `npx` en lugar de `pnpm`
5. **Commitlint no instalado**: El hook `commit-msg` intentaba usar commitlint que no está instalado

## ✅ Solución Aplicada

### 1. Inicializar Husky

```bash
pnpm prepare
```

Esto ejecuta el comando `husky` que:

- Crea la carpeta `.husky/_/`
- Configura `git config core.hooksPath .husky/_`
- Instala los hooks base

### 2. Corregir los Hooks

#### `.husky/pre-commit`

**Antes:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
pnpm build
```

**Después:**

```bash
# Run lint-staged (linting, formatting, type-check)
pnpm exec lint-staged

# If all checks succeed, continue with commit
echo "✅ All pre-commit checks passed!"
```

#### `.husky/pre-push`

**Antes:**

```bash
npm run type-check
```

**Después:**

```bash
# Run type-check before pushing
pnpm type-check
```

#### `.husky/commit-msg`

**Antes:**

```bash
npx --no -- commitlint --edit "$1"
```

**Después:**

```bash
# Commitlint is not installed yet
# Uncomment when you want to enforce conventional commits:
# pnpm exec commitlint --edit "$1"
```

### 3. Dar Permisos de Ejecución

```bash
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

## 🎯 ¿Qué Hace Ahora?

### Pre-commit Hook

Cuando intentas hacer un commit, se ejecuta automáticamente:

1. **ESLint**: Revisa y corrige errores de código

   ```bash
   eslint --fix --max-warnings 0
   ```

2. **Prettier**: Formatea el código

   ```bash
   prettier --write
   ```

3. **Type-check**: Verifica tipos de TypeScript

   ```bash
   pnpm type-check
   ```

4. Si **todo pasa**, el commit continúa ✅
5. Si **algo falla**, el commit se cancela ❌

### Pre-push Hook

Cuando intentas hacer push:

1. **Type-check**: Verifica que no haya errores de tipos

   ```bash
   pnpm type-check
   ```

2. **Build**: Compila el proyecto para asegurar que no hay errores de build

   ```bash
   pnpm build
   ```

3. Si todo pasa, el push continúa ✅
4. Si algo falla, el push se cancela ❌

**⏱️ Tiempo estimado**: 30-60 segundos

## 🧪 Cómo Probar que Funciona

### Prueba 1: Pre-commit con código correcto

```bash
# Modifica un archivo
echo "// Test" >> src/App.tsx

# Intenta hacer commit
git add .
git commit -m "test: verificando husky"

# Deberías ver:
# ✅ All pre-commit checks passed!
```

### Prueba 2: Pre-commit con código incorrecto

```bash
# Crea un archivo con error de tipo
echo "const x: number = 'string'" > src/test.ts

# Intenta hacer commit
git add .
git commit -m "test: con error"

# Deberías ver el error y el commit se cancela ❌
```

### Prueba 3: Pre-push

```bash
# Intenta hacer push
git push

# Deberías ver type-check ejecutándose
```

## 📝 Configuración de lint-staged

En `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings 0",
      "prettier --write",
      "bash -c 'pnpm type-check'"
    ],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

Esto significa que:

- **Archivos `.ts`/`.tsx`**: Se ejecuta ESLint, Prettier y type-check
- **Archivos `.json`/`.css`/`.md`**: Solo se ejecuta Prettier

## ⚙️ Notas Importantes

### Husky v9 vs v8

**Husky v9 (actual)** simplifica los hooks:

- No necesitas `#!/bin/sh`
- No necesitas `. "$(dirname "$0")/_/husky.sh"`
- Solo escribes los comandos directamente

**Husky v8 (antiguo)** requería:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
# comandos aquí
```

### ¿Por qué se eliminó el build del pre-commit?

El build completo (`pnpm build`) puede ser **muy lento** (30-60 segundos), lo que hace el commit muy pesado.

**Mejor práctica actual:**

- ✅ **Pre-commit**: Linting + Formatting + Type-check (rápido: 5-10s)
- ✅ **Pre-push**: Type-check + Build completo (30-60s)
- ✅ **CI/CD**: Build completo + Tests en el servidor

**Configuración actual del pre-push:**

```bash
# .husky/pre-push
echo "🔍 Running type-check..."
pnpm type-check

echo "🏗️  Building project..."
pnpm build

echo "✅ All pre-push checks passed!"
```

Esto asegura que:

- Los **commits son rápidos** (solo lint y type-check)
- Los **pushes son seguros** (build completo antes de subir código)
- No subes código que no compila al repositorio remoto

## 🔄 Si Husky Sigue Sin Funcionar

### 1. Verifica la configuración de Git

```bash
git config core.hooksPath
# Debería mostrar: .husky/_
```

### 2. Verifica que la carpeta existe

```bash
ls -la .husky/_/
# Debería listar archivos como husky.sh, pre-commit, etc.
```

### 3. Verifica permisos (Unix/Mac/WSL)

```bash
ls -l .husky/pre-commit
# Debería mostrar: -rwxr-xr-x (ejecutable)
```

### 4. Reinstala Husky

```bash
# Elimina la configuración
rm -rf .husky/_
git config --unset core.hooksPath

# Reinstala
pnpm prepare
```

### 5. Si estás en Windows sin WSL

En **Git Bash** o **PowerShell**, Husky debería funcionar.
En **CMD**, puede haber problemas. Usa Git Bash para commits.

## 📚 Recursos

- [Husky v9 Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/) (para futuro commitlint)

## ✨ Próximos Pasos (Opcional)

### Agregar Commitlint

Si quieres forzar mensajes de commit convencionales:

```bash
# Instalar commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# Crear configuración
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Descomentar en .husky/commit-msg
# pnpm exec commitlint --edit "$1"
```

Esto forzará mensajes como:

- `feat: nueva funcionalidad`
- `fix: corrección de bug`
- `docs: actualización de documentación`
- `refactor: refactorización de código`
