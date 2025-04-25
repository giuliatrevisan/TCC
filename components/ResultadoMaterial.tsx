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
  estimado: boolean;
}

interface ResultadoMaterialProps {
  material: MaterialResultado;
  index: number;
}

export function ResultadoMaterial({ material, index }: ResultadoMaterialProps) {
  const [expandido, setExpandido] = useState(false);
  const coresAlternadas = ['#E0F2FE', '#DBEAFE'];
  const corFundo = expandido ? '#BBF7D0' : coresAlternadas[index % 2];

  return (
    <TouchableOpacity onPress={() => {
      setExpandido(!expandido)
      console.log('📦 Dados do material:', material)
    }} activeOpacity={0.9}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}

        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={{
          backgroundColor: corFundo,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: expandido ? 2 : 1,
          borderColor: expandido ? '#15803D' : '#CBD5E1',
        }}
      >
        {/* Cabeçalho */}
        <View style={{ backgroundColor: '#2563EB', padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold' }}>
            🔹 Tubo: {material.id}
          </Text>
        </View>


        <View style={{ backgroundColor: '#1E3A8A', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: "#fff", fontSize: 16 }}>
            C informado: {material.estimado ? 0 : material.valorOriginal.toFixed(2)}
          </Text>


          {material.estimado && (
            <Text style={{ color: '#FACC15', marginTop: 4 }}>
              ⚠️ Valor estimado devido à ausência de rugosidade no arquivo.
            </Text>
          )}
        </View>





        {/* Detalhes ao expandir */}
        {expandido && (
          <>
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0F172A' }}>
                🔸 Material mais próximo:
              </Text>
              <Text style={{ fontSize: 16, color: '#DC2626' }}>
                {material.nome} (C médio: {material.comparacoes[0].media})
              </Text>
              <Text style={{ fontSize: 16, marginTop: 4 }}>
                📉 Diferença: {material.comparacoes[0].diferenca}
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>
                Materiais mais próximos:
              </Text>

              {material.comparacoes.map((comp, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#93C5FD' : '#BFDBFE',
                    padding: 8,
                    borderRadius: 6,
                    marginTop: 6,
                  }}
                >
                  <Text style={{ color: '#1E3A8A', fontSize: 14 }}>
                    • {comp.material} (C = {comp.media.toFixed(2)}, dif = {comp.diferenca.toFixed(2)})
                  </Text>

                </View>
              ))}
            </View>
          </>
        )}
      </MotiView>
    </TouchableOpacity>
  );
}
