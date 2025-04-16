// ResultadoMaterial.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';

interface Comparacao {
  material: string;
  media: number;
  diferenca: number;
}

interface MaterialResultado {
  id: string;
  nome: string;
  valorOriginal: number;
  comparacoes: Comparacao[];
  estimado: boolean; // novo campo
}

interface ResultadoMaterialProps {
  material: MaterialResultado;
  index: number;
}

export function ResultadoMaterial({ material, index }: ResultadoMaterialProps) {
  const [expandido, setExpandido] = useState(false);
  const coresAlternadas = ['#3B82F6', '#1E3A8A'];
  const corFundo = expandido ? '#90ee90' : coresAlternadas[index % 2];

  return (
    <TouchableOpacity onPress={() => setExpandido(!expandido)} activeOpacity={0.9}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={{
          backgroundColor: corFundo,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <View style={{ backgroundColor: '#3B82F6', padding: 8, borderRadius: 8, marginBottom: 6 }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>
            🔹 Tubo: {material.id}
          </Text>
        </View>

        <View style={{ backgroundColor: '#1E3A8A', padding: 8, borderRadius: 8, marginBottom: 6 }}>
          <Text style={{ color: "#fff", fontSize: 16 }}>
            C informado: {material.valorOriginal}
          </Text>
          {material.estimado && (
            <Text style={{ color: '#FFD700', marginTop: 4 }}>
              ⚠️ Valor estimado devido à ausência de rugosidade no arquivo.
            </Text>
          )}
        </View>

        {expandido && (
          <>
            <Text style={{ fontSize: 16, marginTop: 8, fontWeight: '800' }}>
              🔸 Mais próximo: <Text style={{ color: "#ff0000" }}>{material.nome}</Text>  (C médio: {material.comparacoes[0].media})
            </Text>
            <Text style={{ fontSize: 16, marginTop: 5 }}>
              📉 Diferença: {material.comparacoes[0].diferenca}
            </Text>

            <Text style={{ fontSize: 14, marginTop: 8 }}>
              Materiais mais próximos:
            </Text>

            {material.comparacoes.map((comp: Comparacao, idx: number) => (
              <View
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#3B82F6' : '#1E3A8A',
                  padding: 8,
                  borderRadius: 6,
                  marginTop: 6,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14 }}>
                  • {comp.material} (C = {comp.media}, dif = {comp.diferenca})
                </Text>
              </View>
            ))}
          </>
        )}
      </MotiView>
    </TouchableOpacity>
  );
}
