// index.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ResultadoMaterial } from '@/components/ResultadoMaterial';

const materiaisRugosidade = [
  { material: 'Aço corrugado', c: 60 },
  { material: "Aço com juntas 'loc-bar', novas", c: 130 },
  { material: "Aço com juntas 'loc-bar', usadas", c: [90, 100] },
  { material: 'Aço galvanizado', c: 125 },
  { material: 'Aço rebitado, novo', c: 110 },
  { material: 'Aço rebitado, usado', c: [85, 90] },
  { material: 'Aço soldado, novo', c: 130 },
  { material: 'Aço soldado, usado', c: [90, 100] },
  { material: 'Aço soldado com revestimento especial', c: 130 },
  { material: 'Aço zincado', c: [140, 145] },
  { material: 'Alumínio', c: [140, 145] },
  { material: 'Cimento-amianto', c: [130, 140] },
  { material: 'Concreto, com bom acabamento', c: 130 },
  { material: 'Concreto, com acabamento comum', c: 120 },
  { material: 'Ferro fundido, novo', c: 130 },
  { material: 'Ferro fundido, usado', c: [90, 100] },
  { material: 'Plástico', c: [140, 145] },
  { material: 'PVC rígido', c: [145, 150] },
];

function encontrarMaterialPorC(c: number) {
  let candidato: string = 'Desconhecido';
  let menorDiferenca = Infinity;
  const comparacoes: { material: string, media: number, diferenca: number }[] = [];

  for (const item of materiaisRugosidade) {
    const valorC = item.c;
    const media = Array.isArray(valorC) ? (valorC[0] + valorC[1]) / 2 : valorC;
    const diferenca = Math.abs(media - c);
    comparacoes.push({ material: item.material, media, diferenca });

    if (diferenca < menorDiferenca) {
      menorDiferenca = diferenca;
      candidato = item.material;
    }
  }

  comparacoes.sort((a, b) => a.diferenca - b.diferenca);
  return {
    candidato,
    topComparacoes: comparacoes.slice(0, 3),
  };
}

function estimarC(comprimento: number, diametro: number): number {
  let base = 120;
  if (comprimento > 1000) base -= 5;
  if (comprimento > 2000) base -= 10;
  if (diametro < 100) base -= 5;
  if (diametro < 50) base -= 10;
  return Math.max(80, Math.min(base, 140));
}

export default function HomeScreen() {
  const [nodes, setNodes] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  
  type Comparacao = { material: string; media: number; diferenca: number };
  type MaterialResultado = {
    id: string;
    nome: string;
    comparacoes: Comparacao[];
    valorOriginal: number;
    estimado: boolean;
  };

  const [materiais, setMateriais] = useState<MaterialResultado[]>([]);

  const handleUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (res.canceled || !res.assets?.length) return;

    const fileUri = res.assets[0].uri;

    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.split('\n');
      const nodeSection: string[] = [];
      const linkSection: string[] = [];
      const materiaisSection: MaterialResultado[] = [];

      let currentSection = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.includes('[JUNCTIONS]')) {
          currentSection = 'nodes';
          continue;
        }
        if (trimmedLine.includes('[PIPES]')) {
          currentSection = 'links';
          continue;
        }
        if (trimmedLine.startsWith('[')) {
          currentSection = '';
          continue;
        }

        if (currentSection === 'nodes' && trimmedLine && !trimmedLine.startsWith(';')) {
          nodeSection.push(trimmedLine);
        }

        if (currentSection === 'links' && trimmedLine && !trimmedLine.startsWith(';')) {
          linkSection.push(trimmedLine);
          const colunas = trimmedLine.split(/\s+/);
          const id = colunas[0];
          const comprimento = parseFloat(colunas[3]);
          const diametro = parseFloat(colunas[4]);
          let c = parseFloat(colunas[5]);
          let estimado = false;

          if (isNaN(c)) {
            c = estimarC(comprimento, diametro);
            estimado = true;
          }

          const resultado = encontrarMaterialPorC(c);
          materiaisSection.push({
            id,
            nome: resultado.candidato,
            comparacoes: resultado.topComparacoes,
            valorOriginal: c,
            estimado
          });
        }
      }

      setNodes(nodeSection);
      setLinks(linkSection);
      setMateriais(materiaisSection);
    } catch (error) {
      console.error('Erro ao ler o arquivo:', error);
      Alert.alert('Erro', 'Não foi possível ler o arquivo selecionado.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2563EB',
            padding: 14,
            borderRadius: 10,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={handleUpload}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            📂 Selecionar arquivo .inp
          </Text>
        </TouchableOpacity>

        {materiais.map((mat, index) => (
          <ResultadoMaterial key={mat.id} material={mat} index={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
