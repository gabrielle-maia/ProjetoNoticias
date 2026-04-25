import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from './app/services/api';


type Screen =
  | 'home'
  | 'cadastro'
  | 'buscaUf'
  | 'login'
  | 'lembrar'
  | 'buscaTag'
  | 'detalhe'
  | 'autorPerfil'
  | 'autorComentar'
  | 'minhasNoticias'
  | 'novaNoticia'
  | 'editarNoticia'
  | 'leitorPerfil'
  | 'leitorComentar'
  | 'editorPainel'
  | 'editorPerfil'
  | 'publicarDespublicar'
  | 'editarQualquer'
  | 'dashboard'
  | 'crudCidades'
  | 'crudTags'
  | 'crudPerfis'
  | 'crudUf'
  | 'crudNoticias'
  | 'crudUsuarios'
  | 'gerenciarComentarios';

type PerfilLogin = 'Autor' | 'Leitor' | 'Super Admin' | '';

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  tag: string;
  uf: string;
  autor: string;
  publicada: boolean;
}

interface Comentario {
  id: string;
  noticiaId: string;
  autor: string;
  texto: string;
}

interface ItemSimples {
  id: string;
  nome: string;
}

const noticiasIniciais: Noticia[] = [
  {
    id: '1',
    titulo: 'Expo e React Native na prática',
    conteudo: 'Aplicação de exemplo para simular um portal de notícias com múltiplos perfis, navegação entre telas e CRUD completo.',
    tag: 'Tecnologia',
    uf: 'TO',
    autor: 'Gabrielle',
    publicada: true,
  },
  {
    id: '2',
    titulo: 'Projeto acadêmico com CRUD completo',
    conteudo: 'Exemplo de projeto com home, login, perfis e gerenciamento administrativo, seguindo o fluxo pedido na atividade.',
    tag: 'Estudo',
    uf: 'GO',
    autor: 'Autor Demo',
    publicada: false,
  },
];

export default function App() {

  const [screen, setScreen] = useState<Screen>('home');
  const [perfil, setPerfil] = useState<PerfilLogin>('');
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([
    { id: '1', noticiaId: '1', autor: 'Leitor 1', texto: 'Gostei da matéria.' },
  ]);
  const [cidades, setCidades] = useState<ItemSimples[]>([
    { id: '1', nome: 'Palmas' },
    { id: '2', nome: 'Gurupi' },
  ]);
  const [tags, setTags] = useState<ItemSimples[]>([
    { id: '1', nome: 'Tecnologia' },
    { id: '2', nome: 'Estudo' },
  ]);
  const [perfis, setPerfis] = useState<ItemSimples[]>([
    { id: '1', nome: 'Autor' },
    { id: '2', nome: 'Leitor' },
    { id: '3', nome: 'Editor' },
    { id: '4', nome: 'Super Admin' },
  ]);
  const [ufs, setUfs] = useState<ItemSimples[]>([
    { id: '1', nome: 'TO' },
    { id: '2', nome: 'GO' },
  ]);
  const [usuarios, setUsuarios] = useState<ItemSimples[]>([
    { id: '1', nome: 'Gabrielle Maia' },
    { id: '2', nome: 'Usuário Demo' },
  ]);

  const [selectedId, setSelectedId] = useState<string>('1');
  const [searchTag, setSearchTag] = useState('');
  const [searchUf, setSearchUf] = useState('');
  const [commentText, setCommentText] = useState('');

  const [newsForm, setNewsForm] = useState({
    id: '',
    titulo: '',
    conteudo: '',
    tag: '',
    uf: '',
    autor: 'Gabrielle',
  });

  const [simpleInput, setSimpleInput] = useState('');

  useEffect(() => {
  api.get('/noticias')
    .then((res) => {
      setNoticias(res.data);
    })
    .catch((err) => {
      console.log('Erro ao buscar:', err);
    });
}, []);

  const noticiaSelecionada = noticias.find((n) => n.id === selectedId) || noticias[0];

  const noticiasPublicadas = useMemo(() => noticias.filter((n) => n.publicada), [noticias]);

  const noticiasPorTag = useMemo(() => {
    return noticiasPublicadas.filter((n) =>
      n.tag.toLowerCase().includes(searchTag.toLowerCase())
    );
  }, [noticiasPublicadas, searchTag]);

  const noticiasPorUf = useMemo(() => {
    return noticiasPublicadas.filter((n) =>
      n.uf.toLowerCase().includes(searchUf.toLowerCase())
    );
  }, [noticiasPublicadas, searchUf]);

  const minhasNoticias = useMemo(() => noticias.filter((n) => n.autor === 'Gabrielle'), [noticias]);

  const comentariosDaNoticia = useMemo(() => {
    return comentarios.filter((c) => c.noticiaId === noticiaSelecionada?.id);
  }, [comentarios, noticiaSelecionada]);

  function goLoginAs(tipo: PerfilLogin) {
    setPerfil(tipo);
    if (tipo === 'Autor') setScreen('autorPerfil');
    if (tipo === 'Leitor') setScreen('leitorPerfil');
    if (tipo === 'Super Admin') setScreen('dashboard');
  }

  function openDetalhe(id: string) {
    setSelectedId(id);
    setScreen('detalhe');
  }

  async function salvarNoticia() {
  if (!newsForm.titulo.trim() || !newsForm.conteudo.trim() || !newsForm.tag.trim() || !newsForm.uf.trim()) {
    Alert.alert('Atenção', 'Preencha todos os campos da notícia.');
    return;
  }

  try {
    if (newsForm.id) {
      await api.put(`/noticias/${newsForm.id}`, {
        titulo: newsForm.titulo,
        conteudo: newsForm.conteudo,
        autor: newsForm.autor,
        tag: newsForm.tag,
        uf: newsForm.uf,
      });

      Alert.alert('Sucesso', 'Notícia atualizada com sucesso.');
    } else {
      await api.post('/noticias', {
        titulo: newsForm.titulo,
        conteudo: newsForm.conteudo,
        autor: newsForm.autor,
        tag: newsForm.tag,
        uf: newsForm.uf,
      });

      Alert.alert('Sucesso', 'Nova notícia cadastrada.');
    }

    const res = await api.get('/noticias');
    setNoticias(res.data);

    limparFormulario();
    setScreen('minhasNoticias');
  } catch (error) {
    console.log('Erro ao salvar notícia:', error);
    Alert.alert('Erro', 'Não foi possível salvar a notícia.');
  }
}

  function limparFormulario() {
    setNewsForm({
      id: '',
      titulo: '',
      conteudo: '',
      tag: '',
      uf: '',
      autor: 'Gabrielle',
    });
  }

  function prepararEdicao(id: string) {
    const noticia = noticias.find((n) => n.id === id);
    if (!noticia) return;

    setNewsForm({
      id: noticia.id,
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      tag: noticia.tag,
      uf: noticia.uf,
      autor: noticia.autor,
    });
    setScreen('editarNoticia');
  }

  async function excluirNoticia(id: string) {
  try {
    await api.delete(`/noticias/${id}`);

    const res = await api.get('/noticias');
    setNoticias(res.data);

    Alert.alert('Sucesso', 'Notícia removida.');
  } catch (error) {
    console.log('Erro ao excluir notícia:', error);
    Alert.alert('Erro', 'Não foi possível excluir a notícia.');
  }
}

 async function togglePublicacao(id: string) {
  try {
    const noticia = noticias.find((n) => n.id === id);
    if (!noticia) return;

    await api.put(`/noticias/${id}`, {
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      autor: noticia.autor,
      tag: noticia.tag,
      uf: noticia.uf,
      publicada: noticia.publicada ? 0 : 1,
    });

    const res = await api.get('/noticias');
    setNoticias(res.data);
  } catch (error) {
    console.log('Erro ao publicar/despublicar:', error);
    Alert.alert('Erro', 'Não foi possível alterar a publicação.');
  }
}

  function comentarAtual(nomeAutor: string) {
    if (!commentText.trim()) {
      Alert.alert('Atenção', 'Digite um comentário.');
      return;
    }

    const novo: Comentario = {
      id: Date.now().toString(),
      noticiaId: noticiaSelecionada.id,
      autor: nomeAutor,
      texto: commentText,
    };

    setComentarios((prev) => [...prev, novo]);
    setCommentText('');
    Alert.alert('Sucesso', 'Comentário adicionado.');
  }

  function addSimpleItem(
    setter: React.Dispatch<React.SetStateAction<ItemSimples[]>>,
    lista: ItemSimples[],
    nomeItem: string
  ) {
    if (!simpleInput.trim()) {
      Alert.alert('Atenção', `Digite um ${nomeItem.toLowerCase()}.`);
      return;
    }

    setter([...lista, { id: Date.now().toString(), nome: simpleInput.trim() }]);
    setSimpleInput('');
  }

  function removeSimpleItem(
    setter: React.Dispatch<React.SetStateAction<ItemSimples[]>>,
    lista: ItemSimples[],
    id: string
  ) {
    setter(lista.filter((item) => item.id !== id));
  }

  function Header({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
      <View style={styles.headerBox}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    );
  }

  function MenuButton({ label, onPress, variant = 'primary' }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger' }) {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'secondary' && styles.secondaryButton,
          variant === 'danger' && styles.dangerButton,
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.buttonText,
            variant === 'secondary' && styles.secondaryButtonText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  function BackHome() {
    return <MenuButton label="Voltar para Home" onPress={() => setScreen('home')} variant="secondary" />;
  }

  function CardNoticia({ item, showActions = false, editorMode = false }: { item: Noticia; showActions?: boolean; editorMode?: boolean }) {
    return (
      <View style={styles.card}>
        <View style={styles.tagRow}>
          <Text style={styles.tagBadge}>{item.tag}</Text>
          <Text style={styles.ufBadge}>{item.uf}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardMeta}>Autor: {item.autor}</Text>
        <Text style={styles.cardText}>{item.conteudo}</Text>
        <Text style={styles.status}>{item.publicada ? 'Publicada' : 'Rascunho'}</Text>

        <MenuButton label="Ver detalhe" onPress={() => openDetalhe(item.id)} />

        {showActions ? (
          <View>
            <MenuButton label="Editar notícia" onPress={() => prepararEdicao(item.id)} />
            <MenuButton label="Excluir" onPress={() => excluirNoticia(item.id)} variant="danger" />
          </View>
        ) : null}

        {editorMode ? (
          <MenuButton
            label={item.publicada ? 'Despublicar' : 'Publicar'}
            onPress={() => togglePublicacao(item.id)}
            variant="secondary"
          />
        ) : null}
      </View>
    );
  }

  function PublicList({ data }: { data: Noticia[] }) {
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma notícia encontrada.</Text>}
        renderItem={({ item }) => <CardNoticia item={item} />}
      />
    );
  }

  function SimpleCrudScreen({
    title,
    data,
    setter,
    itemName,
  }: {
    title: string;
    data: ItemSimples[];
    setter: React.Dispatch<React.SetStateAction<ItemSimples[]>>;
    itemName: string;
  }) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={title} subtitle={`CRUD de ${itemName}`} />
        <TextInput
          style={styles.input}
          placeholder={`Digite ${itemName.toLowerCase()}`}
          placeholderTextColor="#7a8d86"
          value={simpleInput}
          onChangeText={setSimpleInput}
        />
        <MenuButton label={`Adicionar ${itemName}`} onPress={() => addSimpleItem(setter, data, itemName)} />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.rowCard}>
              <Text style={styles.rowText}>{item.nome}</Text>
              <MenuButton
                label="Excluir"
                onPress={() => removeSimpleItem(setter, data, item.id)}
                variant="danger"
              />
            </View>
          )}
        />
        <MenuButton label="Voltar para Dashboard" onPress={() => setScreen('dashboard')} variant="secondary" />
      </SafeAreaView>
    );
  }

  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Home - Lista de Notícias" subtitle="Área pública" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.heroBox}>
            <Text style={styles.heroTitle}>Portal de Notícias</Text>
            <Text style={styles.heroText}>
              Aplicação acadêmica com múltiplos perfis, telas públicas, CRUD e navegação completa.
            </Text>
          </View>

          <MenuButton label="Cadastro" onPress={() => setScreen('cadastro')} />
          <MenuButton label="Busca por UF" onPress={() => setScreen('buscaUf')} />
          <MenuButton label="Login" onPress={() => setScreen('login')} />
          <MenuButton label="Lembrar" onPress={() => setScreen('lembrar')} />
          <MenuButton label="Busca por Tag" onPress={() => setScreen('buscaTag')} />

          <Text style={styles.sectionTitle}>Notícias publicadas</Text>
          {noticiasPublicadas.map((item) => (
            <CardNoticia key={item.id} item={item} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'cadastro') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Cadastro" subtitle="Simulação de formulário" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#7a8d86" />
          <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#7a8d86" />
          <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#7a8d86" secureTextEntry />
          <MenuButton label="Cadastrar" onPress={() => Alert.alert('Sucesso', 'Cadastro realizado.')} />
          <BackHome />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'buscaUf') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Busca por UF" subtitle="Filtrar notícias" />
        <TextInput
          style={styles.input}
          placeholder="Digite a UF, ex: TO"
          placeholderTextColor="#7a8d86"
          value={searchUf}
          onChangeText={setSearchUf}
        />
        <PublicList data={noticiasPorUf} />
        <BackHome />
      </SafeAreaView>
    );
  }

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Login" subtitle="Escolha um perfil para entrar" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput style={styles.input} placeholder="Usuário" placeholderTextColor="#7a8d86" />
          <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#7a8d86" secureTextEntry />
          <MenuButton label="Entrar como Autor" onPress={() => goLoginAs('Autor')} />
          <MenuButton label="Entrar como Leitor" onPress={() => goLoginAs('Leitor')} />
          <MenuButton label="Entrar como Super Admin" onPress={() => goLoginAs('Super Admin')} />
          <BackHome />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'lembrar') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Lembrar senha" subtitle="Recuperação de acesso" />
        <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#7a8d86" />
        <MenuButton label="Enviar recuperação" onPress={() => Alert.alert('Enviado', 'E-mail de recuperação enviado.')} />
        <BackHome />
      </SafeAreaView>
    );
  }

  if (screen === 'buscaTag') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Busca por Tag" subtitle="Filtrar notícias" />
        <TextInput
          style={styles.input}
          placeholder="Digite a tag"
          placeholderTextColor="#7a8d86"
          value={searchTag}
          onChangeText={setSearchTag}
        />
        <PublicList data={noticiasPorTag} />
        <BackHome />
      </SafeAreaView>
    );
  }

  if (screen === 'detalhe') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detalhe da Notícia" subtitle={noticiaSelecionada?.titulo} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <CardNoticia item={noticiaSelecionada} />
          <Text style={styles.sectionTitle}>Comentários</Text>
          {comentariosDaNoticia.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum comentário ainda.</Text>
          ) : (
            comentariosDaNoticia.map((c) => (
              <View key={c.id} style={styles.commentCard}>
                <Text style={styles.commentAuthor}>{c.autor}</Text>
                <Text style={styles.commentText}>{c.texto}</Text>
              </View>
            ))
          )}
          <MenuButton label="Comentar como Autor" onPress={() => setScreen('autorComentar')} />
          <MenuButton label="Comentar como Leitor" onPress={() => setScreen('leitorComentar')} />
          <BackHome />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'autorPerfil') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Meu Perfil" subtitle="Autor" />
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>Nome: Gabrielle</Text>
          <Text style={styles.profileText}>Perfil atual: {perfil || 'Autor'}</Text>
        </View>
        <MenuButton label="Minhas Notícias" onPress={() => setScreen('minhasNoticias')} />
        <MenuButton label="Comentar" onPress={() => setScreen('autorComentar')} />
        <BackHome />
      </SafeAreaView>
    );
  }

  if (screen === 'autorComentar') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Comentar" subtitle="Autor" />
        <Text style={styles.profileText}>Notícia: {noticiaSelecionada?.titulo}</Text>
        <TextInput
          style={[styles.input, styles.multiInput]}
          placeholder="Digite seu comentário"
          placeholderTextColor="#7a8d86"
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <MenuButton label="Enviar comentário" onPress={() => comentarAtual('Autor')} />
        <MenuButton label="Voltar ao Perfil do Autor" onPress={() => setScreen('autorPerfil')} variant="secondary" />
      </SafeAreaView>
    );
  }

  if (screen === 'minhasNoticias') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Minhas Notícias" subtitle="Autor" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <MenuButton
            label="Nova"
            onPress={() => {
              limparFormulario();
              setScreen('novaNoticia');
            }}
          />
          {minhasNoticias.length === 0 ? (
            <Text style={styles.emptyText}>Você ainda não cadastrou notícias.</Text>
          ) : (
            minhasNoticias.map((item) => (
              <CardNoticia key={item.id} item={item} showActions />
            ))
          )}
          <MenuButton label="Voltar ao Perfil do Autor" onPress={() => setScreen('autorPerfil')} variant="secondary" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'novaNoticia' || screen === 'editarNoticia') {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={screen === 'novaNoticia' ? 'Nova Notícia' : 'Editar Notícia'}
          subtitle="Formulário do Autor"
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#7a8d86"
            value={newsForm.titulo}
            onChangeText={(text) => setNewsForm((prev) => ({ ...prev, titulo: text }))}
          />
          <TextInput
            style={[styles.input, styles.multiInput]}
            placeholder="Conteúdo"
            placeholderTextColor="#7a8d86"
            value={newsForm.conteudo}
            onChangeText={(text) => setNewsForm((prev) => ({ ...prev, conteudo: text }))}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Tag"
            placeholderTextColor="#7a8d86"
            value={newsForm.tag}
            onChangeText={(text) => setNewsForm((prev) => ({ ...prev, tag: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="UF"
            placeholderTextColor="#7a8d86"
            value={newsForm.uf}
            onChangeText={(text) => setNewsForm((prev) => ({ ...prev, uf: text }))}
          />
          <MenuButton label="Salvar notícia" onPress={salvarNoticia} />
          <MenuButton label="Voltar para Minhas Notícias" onPress={() => setScreen('minhasNoticias')} variant="secondary" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'leitorPerfil') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Meu Perfil" subtitle="Leitor" />
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>Bem-vindo à área do leitor.</Text>
          <Text style={styles.profileText}>Aqui você pode acompanhar notícias e comentar.</Text>
        </View>
        <MenuButton label="Comentar" onPress={() => setScreen('leitorComentar')} />
        <BackHome />
      </SafeAreaView>
    );
  }

  if (screen === 'leitorComentar') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Comentar" subtitle="Leitor" />
        <Text style={styles.profileText}>Notícia: {noticiaSelecionada?.titulo}</Text>
        <TextInput
          style={[styles.input, styles.multiInput]}
          placeholder="Digite seu comentário"
          placeholderTextColor="#7a8d86"
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <MenuButton label="Enviar comentário" onPress={() => comentarAtual('Leitor')} />
        <MenuButton label="Voltar ao Perfil do Leitor" onPress={() => setScreen('leitorPerfil')} variant="secondary" />
      </SafeAreaView>
    );
  }

  if (screen === 'editorPainel') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Painel" subtitle="Editor" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <MenuButton label="Publicar / Despublicar" onPress={() => setScreen('publicarDespublicar')} />
          <MenuButton label="Editar Qualquer Notícia" onPress={() => setScreen('editarQualquer')} />
          <MenuButton label="Meu Perfil" onPress={() => setScreen('editorPerfil')} />
          <BackHome />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'editorPerfil') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Meu Perfil" subtitle="Editor" />
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>Editor responsável pela moderação e publicação.</Text>
        </View>
        <MenuButton label="Voltar ao Painel" onPress={() => setScreen('editorPainel')} variant="secondary" />
      </SafeAreaView>
    );
  }

  if (screen === 'publicarDespublicar') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Publicar / Despublicar" subtitle="Editor" />
        <FlatList
          data={noticias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CardNoticia item={item} editorMode />}
        />
        <MenuButton label="Voltar ao Painel" onPress={() => setScreen('editorPainel')} variant="secondary" />
      </SafeAreaView>
    );
  }

  if (screen === 'editarQualquer') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Editar Qualquer Notícia" subtitle="Editor" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {noticias.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <MenuButton label="Editar" onPress={() => prepararEdicao(item.id)} />
            </View>
          ))}
          <MenuButton label="Voltar ao Painel" onPress={() => setScreen('editorPainel')} variant="secondary" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" subtitle="Super Admin" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <MenuButton label="CRUD Cidades" onPress={() => setScreen('crudCidades')} />
          <MenuButton label="CRUD Tags" onPress={() => setScreen('crudTags')} />
          <MenuButton label="CRUD Perfis" onPress={() => setScreen('crudPerfis')} />
          <MenuButton label="CRUD UF" onPress={() => setScreen('crudUf')} />
          <MenuButton label="CRUD Notícias" onPress={() => setScreen('crudNoticias')} />
          <MenuButton label="CRUD Usuários" onPress={() => setScreen('crudUsuarios')} />
          <MenuButton label="Gerenciar Comentários" onPress={() => setScreen('gerenciarComentarios')} />
          <MenuButton label="Painel do Editor" onPress={() => setScreen('editorPainel')} />
          <BackHome />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'crudCidades') {
    return <SimpleCrudScreen title="CRUD Cidades" data={cidades} setter={setCidades} itemName="Cidade" />;
  }

  if (screen === 'crudTags') {
    return <SimpleCrudScreen title="CRUD Tags" data={tags} setter={setTags} itemName="Tag" />;
  }

  if (screen === 'crudPerfis') {
    return <SimpleCrudScreen title="CRUD Perfis" data={perfis} setter={setPerfis} itemName="Perfil" />;
  }

  if (screen === 'crudUf') {
    return <SimpleCrudScreen title="CRUD UF" data={ufs} setter={setUfs} itemName="UF" />;
  }

  if (screen === 'crudUsuarios') {
    return <SimpleCrudScreen title="CRUD Usuários" data={usuarios} setter={setUsuarios} itemName="Usuário" />;
  }

  if (screen === 'crudNoticias') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="CRUD Notícias" subtitle="Super Admin" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {noticias.map((item) => (
            <CardNoticia key={item.id} item={item} showActions />
          ))}
          <MenuButton label="Voltar para Dashboard" onPress={() => setScreen('dashboard')} variant="secondary" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'gerenciarComentarios') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Gerenciar Comentários" subtitle="Super Admin" />
        <FlatList
          data={comentarios}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum comentário cadastrado.</Text>}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{item.autor}</Text>
              <Text style={styles.commentText}>{item.texto}</Text>
              <MenuButton
                label="Excluir"
                onPress={() => setComentarios((prev) => prev.filter((c) => c.id !== item.id))}
                variant="danger"
              />
            </View>
          )}
        />
        <MenuButton label="Voltar para Dashboard" onPress={() => setScreen('dashboard')} variant="secondary" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Tela não encontrada" />
      <BackHome />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7f4',
    padding: 16,
  },
  headerBox: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1b4332',
  },
  subtitle: {
    fontSize: 15,
    color: '#52796f',
    marginTop: 4,
  },
  heroBox: {
    backgroundColor: '#d8f3dc',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b7e4c7',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b4332',
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    color: '#2d6a4f',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b4332',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: '#d8f3dc',
    borderWidth: 1,
    borderColor: '#95d5b2',
  },
  dangerButton: {
    backgroundColor: '#c1121f',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#1b4332',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cfe1d5',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    color: '#1b4332',
  },
  multiInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dce9e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: '#d8f3dc',
    color: '#1b4332',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '700',
    overflow: 'hidden',
  },
  ufBadge: {
    backgroundColor: '#edf6f9',
    color: '#1d3557',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: '700',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1b4332',
    marginBottom: 6,
  },
  cardMeta: {
    color: '#52796f',
    marginBottom: 4,
    fontWeight: '500',
  },
  cardText: {
    color: '#344e41',
    marginVertical: 8,
    lineHeight: 21,
  },
  status: {
    fontWeight: '800',
    color: '#2d6a4f',
    marginBottom: 10,
  },
  emptyText: {
    color: '#52796f',
    marginTop: 12,
    fontSize: 15,
  },
  commentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dce9e1',
  },
  commentAuthor: {
    fontWeight: '800',
    color: '#1b4332',
    marginBottom: 4,
  },
  commentText: {
    color: '#344e41',
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dce9e1',
  },
  profileText: {
    fontSize: 16,
    color: '#344e41',
    marginBottom: 10,
  },
  rowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dce9e1',
    padding: 12,
    marginBottom: 10,
  },
  rowText: {
    color: '#1b4332',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
});
